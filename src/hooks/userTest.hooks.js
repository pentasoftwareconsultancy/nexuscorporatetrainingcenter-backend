// src/hooks/userTest.hooks.js
import { UserTest } from "../models/test/test.models.js";
import { recalculateUserCertifications } from "../services/certification/certification.service.js";

export function setupUserTestHooks() {
  UserTest.afterCreate(async (userTest, options) => {
    try {
      await recalculateUserCertifications(userTest.userId);
    } catch (err) {
      console.error("Error recalculating certifications after create:", err);
    }
  });

  UserTest.afterUpdate(async (userTest, options) => {
    try {
      await recalculateUserCertifications(userTest.userId);
    } catch (err) {
      console.error("Error recalculating certifications after update:", err);
    }
  });
}
