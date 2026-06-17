export type NotificationChannel = () => Promise<unknown>;

/**
 * Run all order-notification channels (owner email, customer email, push) and
 * WAIT for them to finish.
 *
 * The caller MUST await this. In serverless the function can be frozen the
 * instant the route responds, so firing the sends without awaiting drops the
 * in-flight requests and no notification arrives. Uses allSettled so one
 * failing channel (e.g. push) doesn't prevent the others from completing, and
 * never throws.
 */
export async function dispatchNotifications(
  channels: NotificationChannel[]
): Promise<void> {
  await Promise.allSettled(channels.map((run) => run()));
}
