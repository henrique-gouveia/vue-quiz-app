<template>
	<PageContent
		icon="fa fa-cogs"
		title="Admin"
		subtitle="Questionnaires"
	>
    <b-form>
			<input id="questionnaire-id" type="hidden" v-model="questionnaire.id" />
			<b-row>
				<b-col md="4" sm="12">
					<b-form-group label="Start:" label-for="questionnaire-start">
						<b-form-datepicker
							id="questionnaire-start"
							required
              :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"
              :hide-header="true"
							v-model="questionnaire.start"
							:readonly="mode === 'remove'"
						/>
					</b-form-group>
				</b-col>
				<b-col md="4" sm="12">
					<b-form-group label="End:" label-for="questionnaire-end">
						<b-form-datepicker
							id="questionnaire-end"
							required
              :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"
              :hide-header="true"
							v-model="questionnaire.end"
							:readonly="mode === 'remove'"
						/>
					</b-form-group>
				</b-col>
				<b-col md="4" sm="12">
					<b-form-group label="Total Questions:" label-for="questionnaire-count">
						<b-form-spinbutton
							id="questionnaire-count"
							min="1"
              max="100"
							v-model="questionnaire.count"
              :disabled="mode === 'remove'"
						/>
					</b-form-group>
				</b-col>
			</b-row>
			<b-row>
				<b-col xs="12">
					<b-button variant="primary" v-if="mode === 'save'" @click="save">
						Save
					</b-button>
					<b-button variant="danger" v-if="mode === 'remove'" @click="remove">
						Delete
					</b-button>
					<b-button class="ml-2" @click="reset">
						Cancel
					</b-button>
					<hr />
				</b-col>
			</b-row>
		</b-form>
		<b-table
      responsive
      hover
      striped
      show-empty
      :fields="fields"
      :items="questionnaires"
      :busy="loading"
    >
      <template #table-busy>
        <div class="text-center my-1">
          <b-spinner class="align-middle"></b-spinner>
          <strong class="align-middle ml-2">Loading...</strong>
        </div>
      </template>
      <template #empty class="text-center">
        <p class="text-center">Thre are no data</p>
      </template>
      <template #cell(start)="row">
        {{ row.value | date }}
      </template>
      <template #cell(end)="row">
        {{ row.value | date }}
      </template>
			<template #cell(actions)="data">
        <router-link
          class="btn btn-info mr-2"
          tag="a"
          :to="`quiz/${data.item.id}`"
          target="_blank"
        >
          <i class="fas fa-external-link-alt"></i>
        </router-link>
				<b-button variant="warning" @click="loadQuestionario(data.item)" class="mr-2">
					<i class="fas fa-pencil-alt"></i>
				</b-button>
				<b-button variant="danger" @click="loadQuestionario(data.item, 'remove')">
					<i class="fas fa-trash-alt"></i>
				</b-button>
			</template>
		</b-table>
		<b-pagination
			size="md"
			class="mt-2"
			v-model="page"
			:total-rows="count"
			:per-page="limit"
		/>
	</PageContent>
</template>

<script lang="ts">
import { Component, Watch } from 'vue-property-decorator';
import PageContent from './template/PageContent.vue';
import api from '@/services/api';
import VuePage from '@/models/vue-page';
import Questionnaire from '@/models/questionnaire';

@Component({
  components: {
    PageContent
	}
})
export default class QuestionnairePage extends VuePage {
  mode = 'save';
  loading = false;

	questionnaire: Questionnaire = new Questionnaire();
	questionnaires: Questionnaire[] = [];

  fields: unknown[] = [
    { key: 'start', label: 'Start', sortable: true },
    { key: 'end', label: 'End', sortable: true },
    { key: 'count', label: 'Total Questions', sortable: true },
    { key: 'actions', label: 'Actions', class: 'd-flex' }
	];

  page = 1;
  limit = 0;
  count = 0;

  mounted(): void {
    this.loadQuestionnaires();
  }

  async loadQuestionnaires(): Promise<void> {
    this.loading = true;
    try {
      const res = await api.get(`/questionnaires?page=${this.page}`);
      if (res && res.data) {
        const { data, count, limit } = res.data;

        this.questionnaires = data.map((a: unknown) => new Questionnaire(a));
        this.count = count;
        this.limit = limit;
      }
    } catch (err) {
      this.showError(err);
      this.questionnaires = [];
    } finally {
      this.loading = false;
    }
  }

  async loadQuestionario(questionnaire: Questionnaire, mode = 'save'): Promise<void> {
    this.mode = mode;
    try {
      const res = await api.get(`/questionnaires/${questionnaire.id}`)
      this.questionnaire = new Questionnaire(res.data);
    } catch (err) {
      this.showError(err);
    }
  }

  async save(): Promise<void> {
    const method = this.questionnaire.id ? 'put' : 'post';
    const id = this.questionnaire.id ? `/${this.questionnaire.id}` : '';

    try {
      const questionnaire = {
        id: this.questionnaire.id,
        start: this.questionnaire.start,
        end: this.questionnaire.end,
        count: this.questionnaire.count
      };

      await api[method](`/questionnaires${id}`, questionnaire);

      this.showSuccess();
      this.reset();
    } catch (err) {
      this.showError(err);
    }
  }

  async remove(): Promise<void> {
    const id = this.questionnaire.id;
    try {
      await api.delete(`/questionnaires/${id}`);

      this.showSuccess();
      this.reset();
    } catch (err) {
      this.showError(err);
    }
  }

  reset(): void {
    this.mode = 'save';
    this.page = 1;
    this.questionnaire = new Questionnaire();
    this.loadQuestionnaires();
  }

  @Watch('page')
  onChangePage(): void {
    this.loadQuestionnaires();
  }
}
</script>

<style lang="scss">

</style>
