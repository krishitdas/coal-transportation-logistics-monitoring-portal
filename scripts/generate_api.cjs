const fs = require('fs');
const path = require('path');

const apiDir = path.join(__dirname, '../api');

const templates = {
  'vehicles/index.ts': `import type { VercelResponse } from '@vercel/node';
import connectToDatabase from '../../lib/mongodb';
import Vehicle from '../../models/Vehicle';
import { withAuth, AuthenticatedRequest } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import { vehicleSchema } from '../../validators/vehicle';

async function handler(req: AuthenticatedRequest, res: VercelResponse) {
  await connectToDatabase();

  if (req.method === 'GET') {
    try {
      const { page = 1, limit = 10, search } = req.query;
      const query: any = {};
      if (search) {
        query.vehicleNumber = { $regex: search, $options: 'i' };
      }

      const vehicles = await Vehicle.find(query)
        .sort({ createdAt: -1 })
        .limit(Number(limit))
        .skip((Number(page) - 1) * Number(limit));
        
      const total = await Vehicle.countDocuments(query);
      
      return res.status(200).json({ data: vehicles, meta: { total, page: Number(page), limit: Number(limit) } });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch vehicles' });
    }
  }

  if (req.method === 'POST') {
    try {
      const vehicle = new Vehicle(req.body);
      await vehicle.save();
      return res.status(201).json({ data: vehicle });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to create vehicle' });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}

export default withAuth((req, res) => {
  if (req.method === 'POST') return validate(vehicleSchema, handler)(req, res);
  return handler(req, res);
});`,
  'vehicles/[id].ts': `import type { VercelResponse } from '@vercel/node';
import connectToDatabase from '../../lib/mongodb';
import Vehicle from '../../models/Vehicle';
import { withAuth, AuthenticatedRequest } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import { vehicleUpdateSchema } from '../../validators/vehicle';

async function handler(req: AuthenticatedRequest, res: VercelResponse) {
  const { id } = req.query;
  await connectToDatabase();

  if (req.method === 'GET') {
    try {
      const vehicle = await Vehicle.findById(id);
      if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });
      return res.status(200).json({ data: vehicle });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch vehicle' });
    }
  }

  if (req.method === 'PUT') {
    try {
      const vehicle = await Vehicle.findByIdAndUpdate(id, req.body, { new: true });
      if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });
      return res.status(200).json({ data: vehicle });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to update vehicle' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const vehicle = await Vehicle.findByIdAndDelete(id);
      if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });
      return res.status(200).json({ success: true, message: 'Vehicle deleted' });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to delete vehicle' });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}

export default withAuth((req, res) => {
  if (req.method === 'PUT') return validate(vehicleUpdateSchema, handler)(req, res);
  return handler(req, res);
});`,
  'checkpoints/index.ts': `import type { VercelResponse } from '@vercel/node';
import connectToDatabase from '../../lib/mongodb';
import RouteCheckpoint from '../../models/RouteCheckpoint';
import { withAuth, AuthenticatedRequest } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import { checkpointSchema } from '../../validators/checkpoint';

async function handler(req: AuthenticatedRequest, res: VercelResponse) {
  await connectToDatabase();

  if (req.method === 'POST') {
    try {
      const checkpoint = new RouteCheckpoint(req.body);
      await checkpoint.save();
      return res.status(201).json({ data: checkpoint });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to create checkpoint' });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}

export default withAuth((req, res) => {
  if (req.method === 'POST') return validate(checkpointSchema, handler)(req, res);
  return handler(req, res);
});`,
  'checkpoints/[tripId].ts': `import type { VercelResponse } from '@vercel/node';
import connectToDatabase from '../../lib/mongodb';
import RouteCheckpoint from '../../models/RouteCheckpoint';
import { withAuth, AuthenticatedRequest } from '../../middleware/auth';

async function handler(req: AuthenticatedRequest, res: VercelResponse) {
  const { tripId } = req.query;
  await connectToDatabase();

  if (req.method === 'GET') {
    try {
      const checkpoints = await RouteCheckpoint.find({ tripId }).sort({ timestamp: -1 });
      return res.status(200).json({ data: checkpoints });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch checkpoints' });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}

export default withAuth(handler);`,
  'weighbridge/index.ts': `import type { VercelResponse } from '@vercel/node';
import connectToDatabase from '../../lib/mongodb';
import WeighbridgeEntry from '../../models/WeighbridgeEntry';
import { withAuth, AuthenticatedRequest } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import { weighbridgeSchema } from '../../validators/weighbridge';

async function handler(req: AuthenticatedRequest, res: VercelResponse) {
  await connectToDatabase();

  if (req.method === 'GET') {
    try {
      const { page = 1, limit = 10, tripId } = req.query;
      const query: any = {};
      if (tripId) query.tripId = tripId;

      const entries = await WeighbridgeEntry.find(query)
        .populate('tripId')
        .sort({ createdAt: -1 })
        .limit(Number(limit))
        .skip((Number(page) - 1) * Number(limit));
        
      const total = await WeighbridgeEntry.countDocuments(query);
      
      return res.status(200).json({ data: entries, meta: { total, page: Number(page), limit: Number(limit) } });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch weighbridge entries' });
    }
  }

  if (req.method === 'POST') {
    try {
      const entry = new WeighbridgeEntry({
        ...req.body,
        recordedBy: req.user!.userId
      });
      await entry.save();
      return res.status(201).json({ data: entry });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to create weighbridge entry' });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}

export default withAuth((req, res) => {
  if (req.method === 'POST') return validate(weighbridgeSchema, handler)(req, res);
  return handler(req, res);
});`,
  'weighbridge/[id].ts': `import type { VercelResponse } from '@vercel/node';
import connectToDatabase from '../../lib/mongodb';
import WeighbridgeEntry from '../../models/WeighbridgeEntry';
import { withAuth, AuthenticatedRequest } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import { weighbridgeUpdateSchema } from '../../validators/weighbridge';

async function handler(req: AuthenticatedRequest, res: VercelResponse) {
  const { id } = req.query;
  await connectToDatabase();

  if (req.method === 'PUT') {
    try {
      const entry = await WeighbridgeEntry.findByIdAndUpdate(id, req.body, { new: true });
      if (!entry) return res.status(404).json({ error: 'Entry not found' });
      return res.status(200).json({ data: entry });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to update weighbridge entry' });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}

export default withAuth((req, res) => {
  if (req.method === 'PUT') return validate(weighbridgeUpdateSchema, handler)(req, res);
  return handler(req, res);
});`,
  'dashboard/kpis.ts': `import type { VercelResponse } from '@vercel/node';
import connectToDatabase from '../../lib/mongodb';
import Trip from '../../models/Trip';
import Vehicle from '../../models/Vehicle';
import { withAuth, AuthenticatedRequest } from '../../middleware/auth';

async function handler(req: AuthenticatedRequest, res: VercelResponse) {
  await connectToDatabase();

  if (req.method === 'GET') {
    try {
      const activeTrips = await Trip.countDocuments({ status: { $in: ['InTransit', 'Delayed', 'Flagged'] } });
      const totalVehicles = await Vehicle.countDocuments({ active: true });
      const completedToday = await Trip.countDocuments({ 
        status: 'Delivered',
        actualArrival: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
      });
      
      // Placeholder data
      return res.status(200).json({ 
        data: {
          activeTrips,
          totalVehicles,
          completedToday,
          totalTonnage: 15200 // Mock data for now
        }
      });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch KPIs' });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}

export default withAuth(handler);`,
  'dashboard/trends.ts': `import type { VercelResponse } from '@vercel/node';
import connectToDatabase from '../../lib/mongodb';
import { withAuth, AuthenticatedRequest } from '../../middleware/auth';

async function handler(req: AuthenticatedRequest, res: VercelResponse) {
  await connectToDatabase();
  if (req.method === 'GET') {
    return res.status(200).json({ 
      data: [
        { date: '2026-06-25', count: 120 },
        { date: '2026-06-26', count: 140 },
        { date: '2026-06-27', count: 135 },
        { date: '2026-06-28', count: 150 },
        { date: '2026-06-29', count: 160 },
        { date: '2026-06-30', count: 145 },
        { date: '2026-07-01', count: 180 },
      ]
    });
  }
  return res.status(405).json({ error: 'Method Not Allowed' });
}

export default withAuth(handler);`,
  'dashboard/alerts.ts': `import type { VercelResponse } from '@vercel/node';
import connectToDatabase from '../../lib/mongodb';
import Alert from '../../models/Alert';
import { withAuth, AuthenticatedRequest } from '../../middleware/auth';

async function handler(req: AuthenticatedRequest, res: VercelResponse) {
  await connectToDatabase();
  if (req.method === 'GET') {
    try {
      const alerts = await Alert.find({ status: 'Active' })
        .populate('relatedTripId', 'tripId')
        .populate('relatedVehicleId', 'vehicleNumber')
        .sort({ severity: 1, createdAt: -1 })
        .limit(5);
      return res.status(200).json({ data: alerts });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch dashboard alerts' });
    }
  }
  return res.status(405).json({ error: 'Method Not Allowed' });
}

export default withAuth(handler);`,
  'dashboard/live-trips.ts': `import type { VercelResponse } from '@vercel/node';
import connectToDatabase from '../../lib/mongodb';
import Trip from '../../models/Trip';
import { withAuth, AuthenticatedRequest } from '../../middleware/auth';

async function handler(req: AuthenticatedRequest, res: VercelResponse) {
  await connectToDatabase();
  if (req.method === 'GET') {
    try {
      const trips = await Trip.find({ status: 'InTransit' })
        .populate('vehicleId', 'vehicleNumber')
        .sort({ dispatchDate: -1 })
        .limit(10);
      return res.status(200).json({ data: trips });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch live trips' });
    }
  }
  return res.status(405).json({ error: 'Method Not Allowed' });
}

export default withAuth(handler);`,
  'reports/daily.ts': `import type { VercelResponse } from '@vercel/node';
import connectToDatabase from '../../lib/mongodb';
import Trip from '../../models/Trip';
import { withAuth, AuthenticatedRequest } from '../../middleware/auth';

async function handler(req: AuthenticatedRequest, res: VercelResponse) {
  await connectToDatabase();
  if (req.method === 'GET') {
    try {
      const today = new Date();
      today.setHours(0,0,0,0);
      const data = await Trip.find({ dispatchDate: { $gte: today } }).populate('vehicleId', 'vehicleNumber');
      return res.status(200).json({ data });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch daily report' });
    }
  }
  return res.status(405).json({ error: 'Method Not Allowed' });
}

export default withAuth(handler);`,
  'reports/delayed.ts': `import type { VercelResponse } from '@vercel/node';
import connectToDatabase from '../../lib/mongodb';
import Trip from '../../models/Trip';
import { withAuth, AuthenticatedRequest } from '../../middleware/auth';

async function handler(req: AuthenticatedRequest, res: VercelResponse) {
  await connectToDatabase();
  if (req.method === 'GET') {
    try {
      const data = await Trip.find({ status: 'Delayed' }).populate('vehicleId', 'vehicleNumber');
      return res.status(200).json({ data });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch delayed report' });
    }
  }
  return res.status(405).json({ error: 'Method Not Allowed' });
}

export default withAuth(handler);`,
  'reports/variance.ts': `import type { VercelResponse } from '@vercel/node';
import connectToDatabase from '../../lib/mongodb';
import WeighbridgeEntry from '../../models/WeighbridgeEntry';
import { withAuth, AuthenticatedRequest } from '../../middleware/auth';

async function handler(req: AuthenticatedRequest, res: VercelResponse) {
  await connectToDatabase();
  if (req.method === 'GET') {
    try {
      const data = await WeighbridgeEntry.find({ variancePercentage: { $gt: 2 } }).populate('tripId');
      return res.status(200).json({ data });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch variance report' });
    }
  }
  return res.status(405).json({ error: 'Method Not Allowed' });
}

export default withAuth(handler);`,
  'reports/utilization.ts': `import type { VercelResponse } from '@vercel/node';
import connectToDatabase from '../../lib/mongodb';
import { withAuth, AuthenticatedRequest } from '../../middleware/auth';

async function handler(req: AuthenticatedRequest, res: VercelResponse) {
  await connectToDatabase();
  if (req.method === 'GET') {
    return res.status(200).json({ data: [] }); // placeholder
  }
  return res.status(405).json({ error: 'Method Not Allowed' });
}

export default withAuth(handler);`,
  'reports/routes.ts': `import type { VercelResponse } from '@vercel/node';
import connectToDatabase from '../../lib/mongodb';
import { withAuth, AuthenticatedRequest } from '../../middleware/auth';

async function handler(req: AuthenticatedRequest, res: VercelResponse) {
  await connectToDatabase();
  if (req.method === 'GET') {
    return res.status(200).json({ data: [] }); // placeholder
  }
  return res.status(405).json({ error: 'Method Not Allowed' });
}

export default withAuth(handler);`,
  'alerts/index.ts': `import type { VercelResponse } from '@vercel/node';
import connectToDatabase from '../../lib/mongodb';
import Alert from '../../models/Alert';
import { withAuth, AuthenticatedRequest } from '../../middleware/auth';

async function handler(req: AuthenticatedRequest, res: VercelResponse) {
  await connectToDatabase();

  if (req.method === 'GET') {
    try {
      const { page = 1, limit = 10, status } = req.query;
      const query: any = {};
      if (status) query.status = status;

      const alerts = await Alert.find(query)
        .populate('relatedTripId')
        .populate('relatedVehicleId')
        .sort({ createdAt: -1 })
        .limit(Number(limit))
        .skip((Number(page) - 1) * Number(limit));
        
      const total = await Alert.countDocuments(query);
      
      return res.status(200).json({ data: alerts, meta: { total, page: Number(page), limit: Number(limit) } });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch alerts' });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}

export default withAuth(handler);`,
  'alerts/[id]/read.ts': `import type { VercelResponse } from '@vercel/node';
import connectToDatabase from '../../../lib/mongodb';
import Alert from '../../../models/Alert';
import { withAuth, AuthenticatedRequest } from '../../../middleware/auth';

async function handler(req: AuthenticatedRequest, res: VercelResponse) {
  const { id } = req.query;
  await connectToDatabase();

  if (req.method === 'PUT') {
    try {
      const alert = await Alert.findByIdAndUpdate(id, { status: 'Acknowledged' }, { new: true });
      if (!alert) return res.status(404).json({ error: 'Alert not found' });
      return res.status(200).json({ data: alert });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to update alert' });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}

export default withAuth(handler);`
};

Object.entries(templates).forEach(([filePath, content]) => {
  const fullPath = path.join(apiDir, filePath);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(fullPath, content);
  console.log('Created: ', fullPath);
});
