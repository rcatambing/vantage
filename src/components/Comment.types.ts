export interface ICommentAuthor {
  readonly name: string;
  readonly avatar?: string;
  readonly role: string;
}

export interface IComment {
  readonly id: string;
  readonly author: ICommentAuthor;
  readonly timestamp: Date;
  readonly content: string;
  readonly likesCount: number;
  readonly replies?: readonly IComment[];
}
