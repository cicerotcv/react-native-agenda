import { Blueprint as Bp } from '@cicerotcv/blueprint';

const titleSchema = Bp.lorem.sentence(3).transform((s) => s.replace('.', ''));
const descriptionSchema = Bp.lorem.sentences(5);

const dateSchema = Bp.date.between('2023-01-22', '2023-02-25');

const todoSchema = Bp.object({
  id: Bp.datatype.uuid(),
  title: titleSchema,
  description: descriptionSchema,
  date: dateSchema,
});

const todoCollectionSchema = Bp.array({
  minLength: 30,
  maxLength: 40,
  schema: todoSchema,
});

export const todoCollection = todoCollectionSchema.compile();
