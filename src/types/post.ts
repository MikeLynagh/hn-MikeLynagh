export type Post = {
   id: number;
   by: string;
   title: string;
   type: string;
   url?: string;
   points?: number;
   time: number;
   descendants?: number;
};