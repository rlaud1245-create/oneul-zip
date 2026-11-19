import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto grid w-full max-w-md place-items-center px-5 py-24 text-center">
      <p className="text-5xl" aria-hidden>
        🧭
      </p>
      <h1 className="mt-4 text-2xl font-bold">페이지를 찾을 수 없어요</h1>
      <p className="mt-2 text-muted">주소가 바뀌었거나 없는 페이지예요.</p>
      <Link href="/" className="btn-primary mt-8 w-full">
        홈으로 가기
      </Link>
    </div>
  );
}
