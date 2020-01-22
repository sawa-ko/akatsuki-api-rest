import { ChangelogAuthor } from './changelog.data.model';
import { prop, modelOptions } from '@typegoose/typegoose';

@modelOptions({
  options: {
    customName: 'Changelogs',
  },
})
export class ChangelogModel {
  @prop({ required: true, minlength: 10, maxlength: 250 })
  public title: string;

  @prop({ required: true, minlength: 5, maxlength: 30 })
  public version: string;

  @prop({ required: true, minlength: 10, maxlength: 30 })
  public hash: string;

  @prop({ required: true, minlength: 50, maxlength: 3000 })
  public description: string;

  @prop({ required: true, _id: false })
  public author: ChangelogAuthor;
}
