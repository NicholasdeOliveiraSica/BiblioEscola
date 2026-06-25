<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useEmprestimos } from '@/composables/useEmprestimos';
import { useAlunos } from '@/composables/useAlunos';
import { useTurmas } from '@/composables/useTurmas';
import { useToast } from '@/composables/useToast';
import PageHeader from '@/components/layout/PageHeader.vue';
import BaseButton from '@/components/common/BaseButton.vue';
import ConfirmDialog from '@/components/common/ConfirmDialog.vue';
import EmptyState from '@/components/common/EmptyState.vue';
import SearchInput from '@/components/common/SearchInput.vue';
import FilterSelect from '@/components/common/FilterSelect.vue';
import EmprestimoFormModal from '@/components/emprestimos/EmprestimoFormModal.vue';
import DevolucaoConfirmModal from '@/components/emprestimos/DevolucaoConfirmModal.vue';
import EmprestimosTable from '@/components/emprestimos/EmprestimosTable.vue';
import { normalizeText } from '@/utils/normalizeText';
import { Plus } from 'lucide-vue-next';

const { emprestimos, loading: empLoading, listarEmprestimos, criarEmprestimo, devolverEmprestimo, removerEmprestimo } = useEmprestimos();
const { alunos, listarAlunos } = useAlunos();
const { turmas, listarTurmas } = useTurmas();
const { showToast } = useToast();
const route = useRoute();

const searchQuery = ref('');
const filterStatus = ref('');
const filterTurmaId = ref('');
const showModal = ref(false);
const showDeleteConfirm = ref(false);
const showReturnConfirm = ref(false);
const selectedEmp = ref(null);
const preselectedAlunoId = ref('');

onMounted(() => {
  listarEmprestimos();
  listarAlunos();
  listarTurmas();
  if (route.query.alunoId) {
    preselectedAlunoId.value = route.query.alunoId.toString();
    showModal.value = true;
  }
});

const statusOptions = [
  { value: 'emprestado', label: 'Em Andamento' },
  { value: 'devolvido', label: 'Devolvido' }
];

const turmaOptions = computed(() => {
  return turmas.value.map(t => ({
    value: t.id,
    label: t.nome
  }));
});

const filteredEmprestimos = computed(() => {
  let result = emprestimos.value;
  
  if (filterStatus.value) {
    result = result.filter(e => e.status === filterStatus.value);
  }
  
  if (filterTurmaId.value) {
    result = result.filter(e => e.turmaId === filterTurmaId.value);
  }
  
  const query = normalizeText(searchQuery.value);
  if (query) {
    result = result.filter(e => 
      normalizeText(e.livro).includes(query) || 
      normalizeText(e.alunoNome).includes(query)
    );
  }
  
  return result;
});

const openCreateModal = () => {
  preselectedAlunoId.value = '';
  showModal.value = true;
};

const handleModalClose = () => {
  showModal.value = false;
  preselectedAlunoId.value = '';
};

const openReturnConfirm = (emp) => {
  selectedEmp.value = emp;
  showReturnConfirm.value = true;
};

const openDeleteConfirm = (emp) => {
  selectedEmp.value = emp;
  showDeleteConfirm.value = true;
};

const handleFormSubmit = async (payload) => {
  try {
    await criarEmprestimo(payload);
    showToast('Empréstimo registrado com sucesso!');
    showModal.value = false;
    preselectedAlunoId.value = '';
    // Refresh student statistics
    listarAlunos();
  } catch (err) {
    showToast(err.message || 'Erro ao realizar empréstimo.', 'error');
  }
};

const handleReturnConfirm = async () => {
  if (!selectedEmp.value) return;
  try {
    await devolverEmprestimo(selectedEmp.value.id);
    showToast('Devolução registrada com sucesso!');
    showReturnConfirm.value = false;
    listarAlunos(); // Refresh student statistics
  } catch (err) {
    showToast(err.message || 'Erro ao registrar devolução.', 'error');
  }
};

const handleDeleteConfirm = async () => {
  if (!selectedEmp.value) return;
  try {
    await removerEmprestimo(selectedEmp.value.id);
    showToast('Registro de empréstimo excluído!');
    showDeleteConfirm.value = false;
    listarAlunos(); // Refresh student statistics
  } catch (err) {
    showToast(err.message || 'Erro ao remover empréstimo.', 'error');
  }
};
</script>

<template>
  <div>
    <PageHeader 
      title="Empréstimos" 
      description="Gerenciamento de empréstimos de livros para alunos."
    >
      <template #actions>
        <BaseButton variant="primary" @click="openCreateModal" :disabled="alunos.length === 0">
          <template #icon><Plus class="h-4 w-4" /></template>
          Novo Empréstimo
        </BaseButton>
      </template>
    </PageHeader>

    <!-- Warning if no students -->
    <div v-if="alunos.length === 0" class="mb-6 bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-lg text-sm flex items-center justify-between select-none">
      <div class="flex items-center space-x-2">
        <svg class="h-5 w-5 text-amber-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span>Você precisa ter alunos cadastrados antes de poder registrar empréstimos.</span>
      </div>
      <RouterLink to="/alunos" class="underline font-bold hover:text-amber-900 transition-colors ml-4 whitespace-nowrap">Cadastrar Alunos</RouterLink>
    </div>

    <!-- Controls -->
    <div class="mb-6 flex flex-col lg:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
      <div class="w-full lg:max-w-xs">
        <SearchInput v-model="searchQuery" placeholder="Pesquisar livro ou aluno..." />
      </div>
      <div class="w-full lg:max-w-xl flex flex-col sm:flex-row items-center gap-4 justify-end">
        <div class="flex items-center space-x-2 w-full sm:max-w-xs">
          <label class="text-xs font-bold text-slate-400 uppercase tracking-wider flex-shrink-0">Turma:</label>
          <FilterSelect 
            v-model="filterTurmaId" 
            :options="turmaOptions" 
            placeholder="Todas" 
          />
        </div>
        <div class="flex items-center space-x-2 w-full sm:max-w-xs">
          <label class="text-xs font-bold text-slate-400 uppercase tracking-wider flex-shrink-0">Status:</label>
          <FilterSelect 
            v-model="filterStatus" 
            :options="statusOptions" 
            placeholder="Todos" 
          />
        </div>
      </div>
    </div>

    <!-- Table or Empty State -->
    <div v-if="empLoading && emprestimos.length === 0" class="py-12 flex justify-center">
      <svg class="animate-spin h-8 w-8 text-brand-600" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>

    <div v-else-if="filteredEmprestimos.length === 0">
      <EmptyState 
        :title="searchQuery || filterStatus || filterTurmaId ? 'Nenhum empréstimo encontrado' : 'Nenhum empréstimo registrado'"
        :description="searchQuery || filterStatus || filterTurmaId ? 'Tente ajustar os filtros ou pesquisar termos diferentes.' : 'Registre o primeiro empréstimo de livro para um aluno.'"
        :show-action="!searchQuery && !filterStatus && !filterTurmaId && alunos.length > 0"
        action-label="Novo Empréstimo"
        @action="openCreateModal"
      />
    </div>

    <EmprestimosTable
      v-else
      :emprestimos="filteredEmprestimos"
      @return="openReturnConfirm"
      @delete="openDeleteConfirm"
    />

    <!-- Create Modal -->
    <EmprestimoFormModal
      :show="showModal"
      :alunos="alunos"
      :preselected-aluno-id="preselectedAlunoId"
      @close="handleModalClose"
      @submit="handleFormSubmit"
    />

    <!-- Return Confirm Modal -->
    <DevolucaoConfirmModal
      :show="showReturnConfirm"
      :emprestimo="selectedEmp"
      @close="showReturnConfirm = false"
      @confirm="handleReturnConfirm"
    />

    <!-- Delete Confirm -->
    <ConfirmDialog 
      :show="showDeleteConfirm" 
      title="Excluir Registro"
      message="Tem certeza que deseja excluir o registro deste empréstimo? Esta ação é definitiva e removerá o histórico do sistema."
      confirm-label="Excluir"
      @close="showDeleteConfirm = false"
      @confirm="handleDeleteConfirm"
    />
  </div>
</template>
