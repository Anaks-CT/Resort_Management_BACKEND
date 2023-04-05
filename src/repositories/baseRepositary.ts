import { Model, Document, FilterQuery, UpdateQuery } from "mongoose";

export abstract class BaseRepository {
  constructor(private readonly model:any) {}

   async getAll<T>(): Promise<T[] | null> {
    return this.model.find();
  }

  async getOne<T>(): Promise<T | null> {
    return this.model.findOne();
  }

  async getByEmail<T>(email: string): Promise<T | null> {
    return this.model.findOne({email: email});
  }

  async getById<T>(id: string): Promise<T  | null> {
    return this.model.findById(id);
  }

  async create<T>(item: T): Promise<T> {
    // return this.model.create(item);
    const newObject = new this.model(item)
    await newObject.save()
    return newObject
  }

  async update<T>(id: string, item: UpdateQuery<T>): Promise<T | null> {
    const filter: FilterQuery<T> = { _id: id };
    const options = { new: true };
    return this.model.findOneAndUpdate(filter, item, options).exec();
  }

  async deleteById<T>(id: string): Promise<T> {
    return await this.model.deleteOne({_id: id});
  }
}
