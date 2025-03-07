import * as mongoose from 'mongoose';
import { Schema, Document } from 'mongoose';
import { schemaOptions } from '../schema-default.options';
import { NotificationTemplateEntity } from './notification-template.entity';

const notificationTemplateSchema = new Schema(
  {
    name: Schema.Types.String,
    description: Schema.Types.String,
    active: {
      type: Schema.Types.Boolean,
      default: false,
    },
    draft: {
      type: Schema.Types.Boolean,
      default: true,
    },
    _notificationGroupId: {
      type: Schema.Types.ObjectId,
      ref: 'NotificationGroup',
    },
    tags: [Schema.Types.String],
    triggers: [
      {
        type: {
          type: Schema.Types.String,
        },
        identifier: Schema.Types.String,
        variables: [
          {
            name: Schema.Types.String,
          },
        ],
      },
    ],

    messages: [
      {
        filters: [
          {
            isNegated: Schema.Types.Boolean,
            type: {
              type: Schema.Types.String,
            },
            value: Schema.Types.String,
            children: [
              {
                field: Schema.Types.String,
                value: Schema.Types.String,
                operator: Schema.Types.String,
              },
            ],
          },
        ],
        _templateId: {
          type: Schema.Types.ObjectId,
          ref: 'MessageTemplate',
        },
      },
    ],
    _applicationId: {
      type: Schema.Types.ObjectId,
      ref: 'Application',
    },
    _organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
    },
    _creatorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  schemaOptions
);

notificationTemplateSchema.virtual('messages.template', {
  ref: 'MessageTemplate',
  localField: 'messages._templateId',
  foreignField: '_id',
  justOne: true,
});

notificationTemplateSchema.virtual('notificationGroup', {
  ref: 'NotificationGroup',
  localField: '_notificationGroupId',
  foreignField: '_id',
  justOne: true,
});

notificationTemplateSchema.index({
  _organizationId: 1,
  'triggers.identifier': 1,
});

interface INotificationTemplateDocument extends NotificationTemplateEntity, Document {
  _id: never;
}

export const NotificationTemplate =
  mongoose.models.NotificationTemplate ||
  mongoose.model<INotificationTemplateDocument>('NotificationTemplate', notificationTemplateSchema);
