import { query } from './database'
import sql from 'sql-template-strings'

export const getTop50 = async position => {
  let q
  if (position === 'FLEX') {
    q = `
    SELECT s.id, p.name, p.position, s.gp, s.pts_ppr/s.gp AS avg_points, s.std_dev, p.owner_id
    FROM season s INNER JOIN players p ON s.id = p.id
    WHERE (p.position = 'RB' OR p.position = 'WR' OR p.position = 'TE') AND s.games_active > 0
    ORDER BY avg_points DESC LIMIT 100;`
  } else {
    q = `
    SELECT s.id, p.name, s.gp, s.pts_ppr/s.gp AS avg_points, s.std_dev, p.owner_id
    FROM season s INNER JOIN players p ON s.id = p.id
    WHERE p.position = '${position}' AND s.gms_active > 0
    ORDER BY avg_points DESC LIMIT 50;`
  }

  const res = await query(q)
  if (!res) {
    console.log('there aint no res!')
    return
  }

  const data = res[0]

  const ret = data.map(p => {
    return {
      id: p['id'],
      name: p['name'],
      position: p['position'],
      gamesPlayed: p['gp'],
      avgPoints: p['avg_points'],
      stdDev: p['std_dev'],
      ownerId: p['owner_id']
    }
  })

  return ret
}

export const getFiveWeekTop50 = async position => {
  let q
  if (position === 'FLEX') {
    q = `
    SELECT w.id, p.name, p.position, p.owner_id, COUNT(DISTINCT w.week) AS games_played, SUM(DISTINCT w.pts_ppr)/COUNT(DISTINCT w.week) AS avg_points
    FROM ((SELECT * FROM JSXR.weeks WHERE week >= 11) AS w INNER JOIN JSXR.players p ON w.id = p.id)
    WHERE p.position = 'rb' OR p.position = 'te' OR p.position = 'wr'
    GROUP BY w.id, p.name, p.position, p.owner_id
    ORDER BY avg_points DESC LIMIT 100;
    `
  } else {
    q = `
    SELECT w.id, p.name, p.position, p.owner_id, COUNT(DISTINCT w.week) AS games_played, SUM(DISTINCT w.pts_ppr)/COUNT(DISTINCT w.week) AS avg_points
    FROM ((SELECT * FROM JSXR.weeks WHERE week >= 11) AS w INNER JOIN JSXR.players p ON w.id = p.id)
    WHERE p.position = '${position}'
    GROUP BY w.id, p.name, p.position, p.owner_id
    ORDER BY avg_points DESC LIMIT 50;
    `
  }

  const res = await query(q)
  if (!res) {
    console.log('there aint no res!')
    return
  }

  const data = res[0]

  const ret = data.map(p => {
    return {
      id: p['id'],
      name: p['name'],
      position: p['position'],
      gamesPlayed: p['games_played'],
      avgPoints: p['avg_points'],
      ownerId: p['owner_id']
    }
  })

  return ret
}

export const getWeeks = async (id, start) => {
  const q = `SELECT pts_ppr, week FROM JSXR.weeks WHERE id = '${id}' AND week >= ${start};`
  const res = await query(q)
  if (!res) {
    console.log('there aint no res!')
    return
  }

  const data = res[0]

  const ret = data.map(w => ({
    ptsPPR: w['pts_ppr'],
    weekNumber: w['week']
  }))
  return ret
}
