<script setup>
import { userAPI } from "@/apis/user";

const route = useRoute();

const { isFollowed } = usePostUserRelation();
const { apiGetUserFollowing } = userAPI();
const { openLoading, closeLoading } = useLoading();
const { pushToast } = useToastStore();
const { updateFollow } = useAuthStore();
const authStore = useAuthStore();
const { userInfo } = storeToRefs(authStore);
const { intersectionObserver } = userIntersectionObserver();

const memberId = ref("");
const following = ref([]);
const page = ref(1);
const hasMoreData = ref(true);
const loadRef = ref(null);

// 取得會員所有追蹤者
async function getUserFollowing() {
  openLoading();

  try {
    const { data } = await apiGetUserFollowing(memberId.value, {
      page: page.value,
    });
    following.value.push(...data.users);

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

// 追蹤/取消追蹤
async function toggleFollow({ actionType, userId }) {
  const data = await updateFollow({ actionType, memberId: userId });

  // 如果錯誤或不是自己的追蹤資料則返回
  if (!data || userInfo.value._id !== memberId.value) {
    return;
  }

  // 找到追蹤資料並從 following 中刪除
  const followingIndex = following.value.findIndex(
    (item) => item._id === userId,
  );

  if (actionType === "unfollow" && followingIndex !== -1) {
    following.value.splice(followingIndex, 1);
  }
}

onMounted(async () => {
  const id = route.params?.userId;

  if (id) {
    memberId.value = id;
    await getUserFollowing();

    intersectionObserver(loadRef.value, getUserFollowing, hasMoreData);
  } else {
    await navigateTo("/");
  }
});
</script>

<template>
  <div>
    <ul v-if="following?.length" class="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <li v-for="follow in following" :key="follow._id" class="">
        <div
          class="bg-light relative flex items-center rounded-md px-4 py-6 xl:px-8"
        >
          <NuxtLink
            :to="`/user/${follow._id}`"
            class="group me-auto flex items-center"
          >
            <img
              v-if="follow.avatar?.imageUrl"
              :src="follow.avatar?.imageUrl"
              class="avatar avatar-default avatar-lg me-3"
            />
            <span v-else class="avatar avatar-default avatar-lg me-4">
              <Icon icon="ic:round-person" />
            </span>

            <div class="text-muted">
              <a href="#" class="hover:text-muted/80 mb-2 block">
                {{ follow.nickName }}
              </a>
            </div>
          </NuxtLink>
          <div v-if="follow._id !== userInfo?._id">
            <a
              v-if="isFollowed(follow._id)"
              href="#"
              class="btn btn-outline-primary btn-sm"
              @click.prevent="
                toggleFollow({ actionType: 'unfollow', userId: follow._id })
              "
            >
              取消追蹤
            </a>
            <a
              v-else
              href="#"
              class="btn btn-primary btn-sm"
              @click.prevent="
                toggleFollow({ actionType: 'follow', userId: follow._id })
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
      v-if="!following.length && !hasMoreData"
      class="bg-light rounded-md p-8"
    >
      <p class="text-muted mb-4 text-center text-xl">啾啾尚未展翅飛向他人 ✨</p>
      <p class="text-muted/70 text-center">也許他還在靜靜觀察樹上的啾友</p>
    </div>
  </div>
</template>

<style scoped></style>
