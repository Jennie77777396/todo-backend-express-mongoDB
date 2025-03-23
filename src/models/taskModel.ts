import mongoose, { Schema, Document } from 'mongoose';

export interface Task extends Document {
  task: string;
  completed: boolean;
  userId: string;
}

const taskSchema = new Schema<Task>({
  task: { type: String, required: true },
  completed: { type: Boolean, default: false },
  userId: { type: String, required: true },
});

export default mongoose.model<Task>('Task', taskSchema);