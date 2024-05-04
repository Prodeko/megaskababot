import express from 'express';
import { isGuild } from '../../common/validators';

const router = express.Router({mergeParams: true});


router.use((req, res, next) => {
  const guild = req.query.guild;
  if (!guild) {
    return res.status(400).send('Guild query parameter is required');
  }

  if (!isGuild(guild)) {
    return res.status(400).send('Invalid guild query parameter');
  }

  next();
});


router.get('/total-points', (req, res) => {
  // Logic to calculate and 
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
