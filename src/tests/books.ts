import { Books, BookStore } from '../models/books'

const store = new BookStore()

describe('Books model', () => {
  it('should have an index method', () => {
    expect(store.index).toBeDefined()
  })
  it('should return list of products', async () => {
    const result = await store.index
    expect(result).toEqual([])
  })
})
