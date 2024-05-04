import express from 'express';

const router = express.Router({mergeParams: true});



router.get('/total-points', (req, res) => {
  // Logic to calculate and return the totalPoints
});

router.get('/:guild/total-kilometers', (req, res) => {
  // Logic to calculate and return the totalKilometers
});

router.get('/:guild/total-entries', (req, res) => {
  // Logic to calculate and return the totalEntries
});

router.get('/:guild/number-of-unique-participants', (req, res) => {
  // Logic to calculate and return the numberOfUniqueParticipants
});

router.get('/:guild/proportion-of-continuing-participants', (req, res) => {
  // Logic to calculate and return the proportionOfContinuingParticipants
});

router.get('/:guild/period', (req, res) => {
  // Logic to calculate and return the period
});

router.get('/:guild/points-gained-in-period', (req, res) => {
  // Logic to calculate and return the pointsGainedInPeriod
});

router.get('/:guild/proportion-of-milestone-achievers', (req, res) => {
  // Logic to calculate and return the proportionOfMilestoneAchievers
});

export default router;
