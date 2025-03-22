import mongoose, { Schema, Document } from 'mongoose';

export interface Task extends Document {
  _id: string;
  task: string;
  completed: boolean;
}

const taskSchema = new Schema<Task>({
  _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  task: { type: String, required: true },
  completed: { type: Boolean, default: false },
});

export default mongoose.model<Task>('Task', taskSchema);