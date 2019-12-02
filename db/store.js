import { query } from './database'
import sql from 'sql-template-strings'

export const getTop50 = async (position) => {
  let q
  if (position === 'FLEX'){
    q = `
    SELECT s.id, s.pts_ppr, p.name, p.position, s.pts_ppr/s.gms_active AS avg_points
    FROM season s INNER JOIN players p ON s.id = p.id
    WHERE (p.position = 'RB' OR p.position = 'WR' OR p.position = 'TE') AND s.gms_active > 0
    ORDER BY avg_points DESC LIMIT 50;` 
  }
  else{
    q = `
    SELECT s.id, s.pts_ppr, p.name, s.pts_ppr/s.gms_active AS avg_points
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
      ptsPPR: p['pts_ppr'],
      name: p['name'],
      position: p['position'],
      avgPoints: p['avg_points'],
    }
  })

  return ret
}