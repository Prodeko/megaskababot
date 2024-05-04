import express from 'express';
import { validatePeriod } from './middleware';
import { calculateGuildStatistics } from '../../analytics/statistics';

const router = express.Router({mergeParams: true});

export interface StatisticsResponse extends express.Response {
  locals: {
    guild: string;
    periodStart: Date;
    periodEnd: Date;
  };
}

// Middleware to validate the period start and end query parameters
router.use(validatePeriod);

router.get('/', async (req, res: StatisticsResponse) => {
  if (req.query.pass !== process.env.ADMIN_PASSWORD) {
		console.log("Wrong password");
		return res.status(401).send("Wrong password!");
	}
  
  const { periodStart, periodEnd } = res.locals;
  try {
    const statistics = await calculateGuildStatistics(periodStart, periodEnd);
    res.json(Object.fromEntries(statistics));
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while calculating statistics');
  }
});

export default router;
