import test from "node:test";
import assert from "node:assert/strict";
import { reserveSend } from "../lib/send-limit.ts";

test("blocks duplicate requests for 60 seconds", () => {
  assert.equal(reserveSend("reader-one", 1000).allowed, true);
  assert.deepEqual(reserveSend("reader-one", 2000), {
    allowed: false,
    retryAfter: 59,
  });
  assert.equal(reserveSend("reader-two", 2000).allowed, true);
  assert.equal(reserveSend("reader-one", 61000).allowed, true);
});

test("failed deliveries can release their reservation", () => {
  const reservation = reserveSend("failed-reader", 100000);
  assert.equal(reservation.allowed, true);
  if (reservation.allowed) reservation.release();
  assert.equal(reserveSend("failed-reader", 100001).allowed, true);
});
