import type { Choice } from "@/types";

export interface VoteStats {
  a: number;
  b: number;
  total: number;
}

/**
 * 투표 저장소 인터페이스
 * - 지금은 서버가 없으므로 전체 통계를 제공하지 않습니다(null).
 * - 내 선택은 컴포넌트에서 localStorage에 저장합니다.
 * - Supabase 연동 시 SupabaseVoteStore를 만들어 아래 voteStore만 교체하면 됩니다.
 *   예) votes 테이블(question_id, choice, created_at) + 집계 뷰
 */
export interface VoteStore {
  /** 전체 투표 통계. 실제 집계가 없으면 null을 반환해야 합니다. 임의 수치를 만들지 마세요. */
  getStats(questionId: string): Promise<VoteStats | null>;
  submit(questionId: string, choice: Choice): Promise<void>;
}

const localVoteStore: VoteStore = {
  async getStats() {
    return null;
  },
  async submit() {
    // 서버 집계 없음
  },
};

export const voteStore: VoteStore = localVoteStore;
