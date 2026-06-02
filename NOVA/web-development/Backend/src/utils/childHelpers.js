export const ageMonthsFromDob = (dateOfBirth) => {
  const dob = new Date(dateOfBirth);
  const now = new Date();
  let months = (now.getFullYear() - dob.getFullYear()) * 12;
  months += now.getMonth() - dob.getMonth();
  if (now.getDate() < dob.getDate()) {
    months -= 1;
  }
  return Math.max(0, months);
};

export const mapChild = (row) => ({
  id: row.id,
  name: row.name,
  dateOfBirth: row.date_of_birth,
  gender: row.gender,
  createdAt: row.created_at,
});

export const mapMeasurement = (row) => ({
  id: row.id,
  childId: row.child_id,
  heightCm: Number(row.height_cm),
  weightKg: Number(row.weight_kg),
  measuredOn: row.measured_on,
  source: row.source,
  createdAt: row.created_at,
});

export const mapAssessment = (row) => ({
  id: row.id,
  childId: row.child_id,
  growthRecordId: row.growth_record_id,
  riskCategory: row.risk_category,
  probabilities: row.probabilities,
  modelVersion: row.model_version,
  createdAt: row.created_at,
});

export const buildFeaturesForAi = (child, measurement) => ({
  ageMonths: ageMonthsFromDob(child.date_of_birth),
  gender: child.gender,
  heightCm: Number(measurement.height_cm),
  weightKg: Number(measurement.weight_kg),
});