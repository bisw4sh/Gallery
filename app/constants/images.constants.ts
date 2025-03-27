export interface ImageT {
  delete(id: bigint): unknown;
  id: bigint;
  created_at: string;
  title: string;
  link: string;
  author: string;
  tags?: string[] | null;
  user_id: string
}
