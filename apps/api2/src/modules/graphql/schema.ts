export class Block {
  number?: number
}

export abstract class IQuery {
  abstract blocks(limit?: number, page?: number): Block[] | Promise<Block[]>

  abstract block(hash?: string): Block | Promise<Block>

  abstract temp__(): boolean | Promise<boolean>
}

export type Date = any
export type JSON = any
