<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useTurmas } from '@/composables/useTurmas';
import { useToast } from '@/composables/useToast';
import PageHeader from '@/components/layout/PageHeader.vue';
import BaseButton from '@/components/common/BaseButton.vue';
import ConfirmDialog from '@/components/common/ConfirmDialog.vue';
import EmptyState from '@/components/common/EmptyState.vue';
import SearchInput from '@/components/common/SearchInput.vue';
import TurmaFormModal from '@/components/turmas/TurmaFormModal.vue';
import TurmasTable from '@/components/turmas/TurmasTable.vue';
import { normalizeText } from '@/utils/normalizeText';
import { Plus } from 'lucide-vue-next';

const { turmas, loading, listarTurmas, criarTurma, editarTurma, removerTurma } = useTurmas();
const { showToast } = useToast();
const route = useRoute();

const searchQuery = ref('');
const showModal = ref(false);
const showDeleteConfirm = ref(false);
const selectedTurma = ref(null);
const isEditing = ref(false);

onMounted(() => {
  listarTurmas();
  if (route.query.new === 'true') {
    openCreateModal();
  }
});

const filteredTurmas = computed(() => {
  const query = normalizeText(searchQuery.value);
  if (!query) return turmas.value;
  return turmas.value.filter(t => 
    normalizeText(t.nome).includes(query)
  );
});

const openCreateModal = () => {
  isEditing.value = false;
  selectedTurma.value = null;
  showModal.value = true;
};

const openEditModal = (turma) => {
  isEditing.value = true;
  selectedTurma.value = turma;
  showModal.value = true;
};

const openDeleteConfirm = (turma) => {
  selectedTurma.value = turma;
  showDeleteConfirm.value = true;
};

const handleFormSubmit = async (payload) => {
  try {
    if (isEditing.value) {
      await editarTurma(payload);
      showToast('Turma atualizada com sucesso!');
    } else {
      await criarTurma(payload);
      showToast('Turma cadastrada com sucesso!');
    }
    showModal.value = false;
  } catch (err) {
    showToast(err.message || 'Erro ao salvar turma.', 'error');
  }
};

const handleDeleteConfirm = async () => {
  if (!selectedTurma.value) return;
  try {
    await removerTurma(selectedTurma.value.id);
    showToast('Turma excluída com sucesso!');
    showDeleteConfirm.value = false;
  } catch (err) {
    showToast(err.message || 'Erro ao remover turma.', 'error');
  }
};
</script>

<template>
  <div>
    <PageHeader 
      title="Turmas" 
      description="Gerenciamento de turmas e classes da escola."
    >
      <template #actions>
        <BaseButton variant="primary" @click="openCreateModal">
          <template #icon><Plus class="h-4 w-4" /></template>
          Nova Turma
        </BaseButton>
      </template>
    </PageHeader>

    <!-- Controls -->
    <div class="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
      <div class="w-full sm:max-w-xs">
        <SearchInput v-model="searchQuery" placeholder="Pesquisar turma..." />
      </div>
      <div class="text-xs text-slate-400 font-bold select-none">
        {{ filteredTurmas.length }} {{ filteredTurmas.length === 1 ? 'turma encontrada' : 'turmas encontradas' }}
      </div>
    </div>

    <!-- Table or Empty State -->
    <div v-if="loading && turmas.length === 0" class="py-12 flex justify-center">
      <svg class="animate-spin h-8 w-8 text-brand-600" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>

    <div v-else-if="filteredTurmas.length === 0">
      <EmptyState 
        :title="searchQuery ? 'Nenhuma turma encontrada' : 'Nenhuma turma cadastrada'"
        :description="searchQuery ? 'Tente ajustar os termos da sua busca.' : 'Comece cadastrando a primeira turma escolar.'"
        :show-action="!searchQuery"
        action-label="Cadastrar Turma"
        @action="openCreateModal"
      />
    </div>

    <TurmasTable 
      v-else
      :turmas="filteredTurmas"
      @edit="openEditModal"
      @delete="openDeleteConfirm"
    />

    <!-- Create/Edit Modal -->
    <TurmaFormModal
      :show="showModal"
      :turma="selectedTurma"
      @close="showModal = false"
      @submit="handleFormSubmit"
    />

    <!-- Delete Confirm -->
    <ConfirmDialog 
      :show="showDeleteConfirm" 
      title="Excluir Turma"
      message="Tem certeza que deseja excluir esta turma? Esta ação removerá a turma permanentemente e só é possível se não houver alunos vinculados."
      confirm-label="Excluir"
      @close="showDeleteConfirm = false"
      @confirm="handleDeleteConfirm"
    />
  </div>
</template>
