const getDatesBetweenDates = (startDate, endDate) => {
  let dates = []
  //to avoid modifying the original date
  const theDate = new Date(startDate)
  while (theDate <= endDate) {
    dates = [...dates, new Date(theDate)]
    theDate.setDate(theDate.getDate() + 1)
  }
  return dates
}

const checkDateQuery = (startDate, endDate, response) => {
  if (!startDate && !endDate) response.status(400).json({ error: 'Ungültiger Filter' })
  if (!startDate && endDate) startDate = '2020-02-29'
  if (!endDate && startDate) endDate = new Date();
  const dateFrom = new Date(startDate);
  const dateTo = new Date(endDate);

  if (isNaN(dateFrom.valueOf())) response.status(400).json({ error: 'Ungültiger Filter' })
  if (isNaN(dateTo.valueOf())) response.status(400).json({ error: 'Ungültiger Filter' })

  return [dateFrom, dateTo]
}

module.exports = {
  getDatesBetweenDates,
  checkDateQuery
}