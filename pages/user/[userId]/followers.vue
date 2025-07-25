<script setup>
import { userAPI } from "@/apis/user";

const route = useRoute();

const { isFollowed } = usePostUserRelation();
const { apiGetUserFollowers } = userAPI();
const { openLoading, closeLoading } = useLoading();
const { pushToast } = useToastStore();
const { updateFollow } = useAuthStore();
const authStore = useAuthStore();
const { userInfo } = storeToRefs(authStore);
const { intersectionObserver } = userIntersectionObserver();

const memberId = ref("");
const followers = ref([]);
const page = ref(1);
const hasMoreData = ref(true);
const loadRef = ref(null);

// 取得會員所有貼文
async function getUserFollowers() {
  openLoading();

  try {
    const { data } = await apiGetUserFollowers(memberId.value, {
      page: page.value,
    });

    followers.value.push(...data.users);

    if (data.pagination?.hasNext) {
      page.value += 1;
    } else {
      hasMoreData.value = false;
    }
  } catch (err) {
    pushToast({
      message: err.response?._data?.message || "取得所有貼文失敗",
      status: "danger",
    });
  } finally {
    closeLoading();
  }
}

onMounted(async () => {
  const id = route.params?.userId;

  if (id) {
    memberId.value = id;
    await getUserFollowers();

    intersectionObserver(loadRef.value, getUserFollowers, hasMoreData);
  } else {
    await navigateTo("/");
  }
});
</script>

<template>
  <div>
    <ul v-if="followers?.length" class="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <li v-for="follower in followers" :key="follower._id" class="">
        <div
          class="bg-light relative flex items-center rounded-md px-4 py-6 xl:px-8"
        >
          <NuxtLink
            :to="`/user/${follower._id}`"
            class="group me-auto flex items-center"
          >
            <img
              v-if="follower.avatar?.imageUrl"
              :src="follower.avatar?.imageUrl"
              class="avatar avatar-default avatar-lg me-3"
            />
            <span v-else class="avatar avatar-default avatar-lg me-4">
              <Icon icon="ic:round-person" />
            </span>

            <div class="text-muted">
              <a href="#" class="hover:text-muted/80 mb-2 block">
                {{ follower.nickName }}
              </a>
            </div>
          </NuxtLink>
          <div v-if="follower._id !== userInfo?._id">
            <a
              v-if="isFollowed(follower._id)"
              href="#"
              class="btn btn-outline-primary btn-sm"
              @click.prevent="
                updateFollow({ actionType: 'unfollow', memberId: follower._id })
              "
            >
              取消追蹤
            </a>
            <a
              v-else
              href="#"
              class="btn btn-primary btn-sm"
              @click.prevent="
                updateFollow({ actionType: 'follow', memberId: follower._id })
              "
            >
              追蹤對方
            </a>
          </div>
        </div>
      </li>
    </ul>

    <div v-if="hasMoreData" ref="loadRef" class="py-8 text-center">
      <p class="text-muted">資料正在飛來的路上 🕊️⋯⋯</p>
    </div>

    <div
      v-if="!followers.length && !hasMoreData"
      class="bg-light rounded-md p-8"
    >
      <p class="text-muted mb-4 text-center text-xl">還沒有啾友飛來 🐣</p>
      <p class="text-muted/70 text-center">啾啾的第一聲，等你來共鳴</p>
    </div>
  </div>
</template>

<style scoped></style>
