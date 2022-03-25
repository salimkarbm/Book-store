import { Books, BookStore } from '../models/books'

const store = new BookStore()
console.log(store)
describe('Books model', () => {
  it('should have an index method', () => {
    expect(store.index).toBeDefined()
  })
  it('should return list of products', async () => {
    const result = await store.index()
    expect(result).toEqual([])
  })
  xit('should have an create method', () => {
    expect(store.create).toBeDefined()
  })
  xit('should return list of products', async () => {
    const result = await store.create
    expect(result).toEqual([])
  })
})
