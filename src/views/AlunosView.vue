<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAlunos } from '@/composables/useAlunos';
import { useTurmas } from '@/composables/useTurmas';
import { useToast } from '@/composables/useToast';
import PageHeader from '@/components/layout/PageHeader.vue';
import BaseButton from '@/components/common/BaseButton.vue';
import ConfirmDialog from '@/components/common/ConfirmDialog.vue';
import EmptyState from '@/components/common/EmptyState.vue';
import SearchInput from '@/components/common/SearchInput.vue';
import FilterSelect from '@/components/common/FilterSelect.vue';
import AlunoFormModal from '@/components/alunos/AlunoFormModal.vue';
import AlunoDetailsModal from '@/components/alunos/AlunoDetailsModal.vue';
import AlunosTable from '@/components/alunos/AlunosTable.vue';
import { normalizeText } from '@/utils/normalizeText';
import { Plus } from 'lucide-vue-next';

const { alunos, loading: alunosLoading, listarAlunos, criarAluno, editarAluno, removerAluno, historicoAluno } = useAlunos();
const { turmas, listarTurmas } = useTurmas();
const { showToast } = useToast();
const router = useRouter();
const route = useRoute();

const searchQuery = ref('');
const filterTurmaId = ref('');
const showModal = ref(false);
const showDeleteConfirm = ref(false);
const showHistoryModal = ref(false);
const selectedAluno = ref(null);
const isEditing = ref(false);
const historyList = ref([]);
const historyLoading = ref(false);

onMounted(() => {
  listarAlunos();
  listarTurmas();
  if (route.query.new === 'true') {
    openCreateModal();
  }
});

const turmaOptions = computed(() => {
  return turmas.value.map(t => ({
    value: t.id,
    label: t.nome
  }));
});

const filteredAlunos = computed(() => {
  let result = alunos.value;
  
  if (filterTurmaId.value) {
    result = result.filter(a => a.turmaId === filterTurmaId.value);
  }
  
  const query = normalizeText(searchQuery.value);
  if (query) {
    result = result.filter(a => 
      normalizeText(a.nome).includes(query)
    );
  }
  
  return result;
});

const openCreateModal = () => {
  isEditing.value = false;
  selectedAluno.value = null;
  showModal.value = true;
};

const openEditModal = (aluno) => {
  isEditing.value = true;
  selectedAluno.value = aluno;
  showModal.value = true;
};

const openDeleteConfirm = (aluno) => {
  selectedAluno.value = aluno;
  showDeleteConfirm.value = true;
};

const openHistoryModal = async (aluno) => {
  selectedAluno.value = aluno;
  showHistoryModal.value = true;
  historyLoading.value = true;
  try {
    historyList.value = await historicoAluno(aluno.id);
  } catch (err) {
    showToast(err.message || 'Erro ao carregar histórico.', 'error');
  } finally {
    historyLoading.value = false;
  }
};

const handleFormSubmit = async (payload) => {
  try {
    if (isEditing.value) {
      await editarAluno(payload);
      showToast('Aluno atualizado com sucesso!');
    } else {
      await criarAluno(payload);
      showToast('Aluno cadastrado com sucesso!');
    }
    showModal.value = false;
  } catch (err) {
    showToast(err.message || 'Erro ao salvar aluno.', 'error');
  }
};

const handleDeleteConfirm = async () => {
  if (!selectedAluno.value) return;
  try {
    await removerAluno(selectedAluno.value.id);
    showToast('Aluno excluído com sucesso!');
    showDeleteConfirm.value = false;
  } catch (err) {
    showToast(err.message || 'Erro ao remover aluno.', 'error');
  }
};

const handleNewLoan = (aluno) => {
  showHistoryModal.value = false;
  router.push(`/emprestimos?alunoId=${aluno.id}`);
};
</script>

<template>
  <div>
    <PageHeader 
      title="Alunos" 
      description="Gerenciamento de alunos matriculados."
    >
      <template #actions>
        <BaseButton variant="primary" @click="openCreateModal" :disabled="turmas.length === 0">
          <template #icon><Plus class="h-4 w-4" /></template>
          Novo Aluno
        </BaseButton>
      </template>
    </PageHeader>

    <!-- Alert if no classes configured yet -->
    <div v-if="turmas.length === 0" class="mb-6 bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-lg text-sm flex items-center justify-between select-none">
      <div class="flex items-center space-x-2">
        <svg class="h-5 w-5 text-amber-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span>Você precisa cadastrar pelo menos uma turma antes de poder cadastrar alunos.</span>
      </div>
      <RouterLink to="/turmas" class="underline font-bold hover:text-amber-900 transition-colors ml-4 whitespace-nowrap">Cadastrar Turmas</RouterLink>
    </div>

    <!-- Controls -->
    <div class="mb-6 flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
      <div class="w-full md:max-w-xs">
        <SearchInput v-model="searchQuery" placeholder="Pesquisar aluno..." />
      </div>
      <div class="w-full md:max-w-xs flex items-center space-x-3">
        <label class="text-xs font-bold text-slate-400 uppercase tracking-wider flex-shrink-0">Filtrar por Turma:</label>
        <FilterSelect 
          v-model="filterTurmaId" 
          :options="turmaOptions" 
          placeholder="Todas as Turmas" 
        />
      </div>
    </div>

    <!-- Table or Empty State -->
    <div v-if="alunosLoading && alunos.length === 0" class="py-12 flex justify-center">
      <svg class="animate-spin h-8 w-8 text-brand-600" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>

    <div v-else-if="filteredAlunos.length === 0">
      <EmptyState 
        :title="searchQuery || filterTurmaId ? 'Nenhum aluno encontrado' : 'Nenhum aluno cadastrado'"
        :description="searchQuery || filterTurmaId ? 'Ajuste os filtros ou o termo de busca.' : 'Comece cadastrando os alunos da escola.'"
        :show-action="!searchQuery && !filterTurmaId && turmas.length > 0"
        action-label="Cadastrar Aluno"
        @action="openCreateModal"
      />
    </div>

    <AlunosTable
      v-else
      :alunos="filteredAlunos"
      @edit="openEditModal"
      @delete="openDeleteConfirm"
      @history="openHistoryModal"
    />

    <!-- Create/Edit Modal -->
    <AlunoFormModal
      :show="showModal"
      :aluno="selectedAluno"
      :turmas="turmas"
      @close="showModal = false"
      @submit="handleFormSubmit"
    />

    <!-- History Modal -->
    <AlunoDetailsModal
      :show="showHistoryModal"
      :aluno="selectedAluno"
      :history="historyList"
      :loading="historyLoading"
      @close="showHistoryModal = false"
      @new-loan="handleNewLoan"
    />

    <!-- Delete Confirm -->
    <ConfirmDialog 
      :show="showDeleteConfirm" 
      title="Excluir Aluno"
      message="Tem certeza que deseja excluir este aluno? Esta ação é definitiva e removerá o histórico de empréstimos do aluno. Não é possível excluir alunos com empréstimos ativos."
      confirm-label="Excluir"
      @close="showDeleteConfirm = false"
      @confirm="handleDeleteConfirm"
    />
  </div>
</template>
