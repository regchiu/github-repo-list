<template>
  <main>
    <h2>🦊 Reg Chiu's repo list:</h2>
    <div class="repo-list">
      <AppCard v-for="repo in repos" :key="repo.id">
        <h1 class="break-all">{{ repo.name }}</h1>
        <p class="break-all">{{ repo.description || '-' }}</p>
        <a class="break-all" :href="repo.html_url" target="_blank" rel="noopener noreferrer">{{
          repo.html_url
        }}</a>
      </AppCard>
      <div v-show="isShowLoadMore">Load more...</div>
    </div>
  </main>
</template>

<script setup>
import { reactive, ref, watch, computed } from 'vue'
import octokit from '@/utils/octokit'
import useInfiniteScroll from '@/composables/useInfiniteScroll'
import AppCard from '@/components/AppCard.vue'

const repos = ref([])
const isMorePage = ref(true)
const pagination = reactive({
  page: 1,
  perPage: 6
})

const { isLoading } = useInfiniteScroll(
  window,
  () => {
    if (isMorePage.value) {
      pagination.page += 1
    }
  },
  {
    behavior: 'smooth',
    distance: 10,
    interval: 1000
  }
)

const isShowLoadMore = computed(() => isMorePage.value && isLoading.value)

async function getUserRepos() {
  const { data } = await octokit.request('GET /users/regchiu/repos', {
    username: 'USERNAME',
    headers: {
      'X-GitHub-Api-Version': '2022-11-28'
    },
    per_page: pagination.perPage,
    page: pagination.page
  })
  if (data.length > 0) {
    repos.value.push(...data)
  } else {
    isMorePage.value = false
  }
}

watch(
  () => pagination.page,
  () => {
    getUserRepos()
  }
)

getUserRepos()
</script>

<style scoped>
.repo-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.break-all {
  word-break: break-all;
}
</style>
