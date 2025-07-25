<script setup>
import { userAPI } from "@/apis/user";

const route = useRoute();

const { getTimeDiff } = useTimeFormat();
const { isSelfContent } = usePostUserRelation();
const { apiGetUserComments } = userAPI();
const { openLoading, closeLoading } = useLoading();
const { pushToast } = useToastStore();
const { deleteComment } = useCommentStore();
const { intersectionObserver } = userIntersectionObserver();

const memberId = ref("");
const comments = ref([]);
const page = ref(1);
const hasMoreData = ref(true);
const loadRef = ref(null);

// 取得會員所有評論
async function getUserComments() {
  openLoading();

  try {
    const { data } = await apiGetUserComments(memberId.value, {
      page: page.value,
    });

    comments.value.push(...data.comments);

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

// 刪除評論
async function deleteCommentItem(commentId) {
  const data = await deleteComment(commentId);
  if (!data) {
    return;
  }

  // 修改本地 comments 資料 - 找到指定評論並刪除
  const commentIndex = comments.value.findIndex(
    (item) => item._id === commentId,
  );
  if (commentIndex !== -1) {
    comments.value.splice(commentIndex, 1);
  }
}

onMounted(async () => {
  const id = route.params?.userId;

  if (id) {
    memberId.value = id;
    await getUserComments();

    intersectionObserver(loadRef.value, getUserComments, hasMoreData);
  } else {
    await navigateTo("/");
  }
});
</script>

<template>
  <div>
    <ul v-if="comments?.length">
      <li
        v-for="comment in comments"
        :key="comment._id"
        class="bg-light relative mb-8 rounded-md p-8 last:mb-0"
      >
        <div class="relative flex justify-between">
          <NuxtLink
            :to="`/user/${comment.user?._id}`"
            class="group mb-6 flex items-center"
          >
            <img
              v-if="comment.user?.avatar?.imageUrl"
              :src="comment.user?.avatar?.imageUrl"
              class="avatar me-3"
            />
            <span v-else class="avatar avatar-default me-3">
              <Icon icon="ic:round-person" />
            </span>

            <div class="text-muted">
              <a href="#" class="hover:text-muted/80 mb-2 block">
                {{ comment.user?.nickName }}
              </a>

              <p class="text-sm">{{ getTimeDiff(comment.createdAt) }}</p>
            </div>
          </NuxtLink>

          <div v-if="isSelfContent(comment)">
            <BaseDropdownMenu>
              <li class="mb-2 last:mb-0">
                <a
                  href="#"
                  class="group itmes-center hover:bg-danger bg-light flex rounded-md px-10 py-2 hover:text-white"
                  @click.prevent="deleteCommentItem(comment._id)"
                >
                  <Icon
                    icon="ic:round-cancel"
                    class="text-danger me-4 text-2xl group-hover:text-white"
                  />
                  刪除評論
                </a>
              </li>
            </BaseDropdownMenu>
          </div>
        </div>

        <p class="ms-14 mb-3 leading-8 tracking-wide">
          {{ comment.content }}
        </p>

        <div class="text-end">
          <NuxtLink
            :to="`/post/${comment.post?._id}`"
            class="btn btn-light btn-sm"
          >
            閱讀原貼文
          </NuxtLink>
        </div>
      </li>
    </ul>

    <div v-if="hasMoreData" ref="loadRef" class="py-8 text-center">
      <p class="text-muted">資料正在飛來的路上 🕊️⋯⋯</p>
    </div>

    <div
      v-if="!comments.length && !hasMoreData"
      class="bg-light rounded-md p-8"
    >
      <p class="text-muted mb-4 text-center text-xl">還沒有任何啾聲 🐥</p>
      <p class="text-muted/70 text-center text-sm">低調型的潛水高手出現了</p>
    </div>
  </div>
</template>

<style scoped></style>
