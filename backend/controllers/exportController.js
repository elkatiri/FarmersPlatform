const { Parser } = require('json2csv');
const XLSX = require('xlsx');
const WorkerProfile = require('../models/WorkerProfile');
const FarmerRequest = require('../models/FarmerRequest');

const buildRows = async (type) => {
  if (type === 'workers') {
    const workers = await WorkerProfile.find().lean();
    return workers.map((worker) => ({
      id: worker._id,
      name: worker.name,
      phone: worker.phone,
      regions: worker.regions.join(', '),
      skills: worker.skills.join(', '),
      experienceLevel: worker.experienceLevel,
      availability: worker.availability,
      transportFlexibility: worker.transportFlexibility,
      status: worker.status,
      createdAt: worker.createdAt,
    }));
  }

  const requests = await FarmerRequest.find().lean();
  return requests.map((request) => ({
    id: request._id,
    workType: request.workType,
    location: request.location,
    startDate: request.startDate,
    endDate: request.endDate,
    workersNeeded: request.workersNeeded,
    transportInfo: request.transportInfo,
    housingProvided: request.housingProvided,
    mealsProvided: request.mealsProvided,
    whatsapp: request.whatsapp,
    notes: request.notes,
    status: request.status,
    createdAt: request.createdAt,
  }));
};

const exportCSV = async (req, res) => {
  const type = req.params.type;
  if (!['workers', 'requests'].includes(type)) {
    return res.status(400).json({ message: 'Invalid export type' });
  }

  const rows = await buildRows(type);
  const parser = new Parser();
  const csv = parser.parse(rows);

  res.header('Content-Type', 'text/csv');
  res.attachment(`${type}.csv`);
  return res.send(csv);
};

const exportExcel = async (req, res) => {
  const type = req.params.type;
  if (!['workers', 'requests'].includes(type)) {
    return res.status(400).json({ message: 'Invalid export type' });
  }

  const rows = await buildRows(type);
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(rows);
  XLSX.utils.book_append_sheet(workbook, worksheet, type);

  const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename=${type}.xlsx`);
  return res.send(buffer);
};

module.exports = {
  exportCSV,
  exportExcel,
};
