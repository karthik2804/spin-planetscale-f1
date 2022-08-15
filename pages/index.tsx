import type { NextPage } from 'next'
import Head from 'next/head'

import useSWR from 'swr'
import LineChart from '@/components/LineChart'
import StandingsItem from '@/components/StandingsItem'

type RaceData = {
  races: Race[]
  standings: Standing[]
}

type Race = {
  id: number
  season: number
  round: number
  race_name: string
  date: string
}

type Standing = {
  name: string
  nationality: string
  points: number
  position: number
  race_name: string
  round: number
  teamId: string
  url: string
}

type Constructor = {
  teamName: string
  points: any[]
}

function fetcher<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  return fetch(input, init).then((res) => res.json())
}

const Home: NextPage = () => {
  const { data, error } = useSWR<RaceData>('https://f1-championship-stats.mike.workers.dev/data.json', fetcher)

  if (error) return

  let raceNames = []
  let raceDates = []
  const datasets = []

  const constructorColor = {
    alfa: '#A32F3C',
    alphatauri: '#587B98',
    alpine: '#4891CC',
    aston_martin: '#46806E',
    ferrari: '#ED1D25',
    haas: '#B7B9BC',
    mclaren: '#E6863B',
    mercedes: '#6BD4BF',
    red_bull: '#2F5ABF',
    williams: '#63BBD9'
  }

  const circuitName = {
    'Bahrain Grand Prix': 'Bahrain',
    'Saudi Arabian Grand Prix': 'Jeddah',
    'Australian Grand Prix': 'Melbourne',
    'Emilia Romagna Grand Prix': 'Imola',
    'Miami Grand Prix': 'Miami',
    'Spanish Grand Prix': 'Catalunya',
    'Monaco Grand Prix': 'Monaco',
    'Azerbaijan Grand Prix': 'Baku',
    'Canadian Grand Prix': 'Montreal',
    'British Grand Prix': 'Silverstone',
    'Austrian Grand Prix': 'Spielberg',
    'French Grand Prix': 'Paul Ricard',
    'Hungarian Grand Prix': 'Hungaroring',
    'Belgian Grand Prix': 'Spa',
    'Dutch Grand Prix': 'Zandvort',
    'Italian Grand Prix': 'Monza',
    'Singapore Grand Prix': 'Marina Bay',
    'Japanese Grand Prix': 'Suzuka',
    'United States Grand Prix': 'Austin',
    'Mexico City Grand Prix': 'Mexico City',
    'Brazilian Grand Prix': 'Sao Paulo',
    'Abu Dhabi Grand Prix': 'Yas Marina'
  }

  if (data) {
    raceNames = data.races.map((item) => circuitName[item.race_name])

    data.races.forEach((item) => {
      const date = item.date
      const f = Intl.DateTimeFormat('en-us', { month: 'short', day: 'numeric' })
      const dateString = f.format(Date.parse(date))

      const dateSplit = dateString.split(' ')
      const dateObj = { month: dateSplit[0], day: Number(dateSplit[1]) + 1 }

      raceDates.push(dateObj)
    })

    const teams: Record<string, Constructor> = {}
    data.standings.forEach((item) => {
      if (!teams[item.teamId]) {
        teams[item.teamId] = { teamName: item.name, points: [] }
      }
      teams[item.teamId].teamName = item.name
      teams[item.teamId].points.push(item.points)
    })

    for (const [key, team] of Object.entries(teams)) {
      datasets.push({
        label: team.teamName,
        data: team.points,
        fill: false,
        borderWidth: 2,
        borderColor: constructorColor[key],
        backgroundColor: constructorColor[key],
        pointBorderColor: '#FFFFFF',
        pointBorderWidth: 2
      })
    }
  }

  const chartData = {
    labels: raceNames,
    datasets: datasets
  }

  console.log(data)

  return (
    <>
      <Head>
        <title>F1 Championship standings</title>
        <meta name='description' content='F1 Championship standings' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <header className='container mx-auto px-6 pt-8 pb-2'>
        <h1 className='text-2xl'>
          <span className='block text-[#E20500]'>2022 Formula 1</span>Constructor championship standings
        </h1>
      </header>

      <main>
        <div className='container relative mx-auto px-6 pb-6'>
          <div className='top-1/2 right-5 z-[1] mb-3 space-y-1 rounded-sm bg-gray-800 p-2 font-bold text-white shadow-xl shadow-black/25 lg:absolute lg:w-38 lg:-translate-y-1/2 xl:right-14 2xl:right-20'>
            <StandingsItem position={1} teamName='Red Bull' totalPoints={431} />
            <StandingsItem position={2} teamName='Ferrari' totalPoints={334} />
            <StandingsItem position={3} teamName='Mercedes' totalPoints={304} />
            <StandingsItem position={4} teamName='Alpine' totalPoints={99} />
            <StandingsItem position={5} teamName='McLaren' totalPoints={95} />
            <StandingsItem position={6} teamName='Alfa Romeo' totalPoints={51} />
            <StandingsItem position={7} teamName='Haas' totalPoints={34} />
            <StandingsItem position={8} teamName='Alfa Tauri' totalPoints={27} />
            <StandingsItem position={9} teamName='Aston Martin' totalPoints={20} />
            <StandingsItem position={10} teamName='Williams' totalPoints={3} />
          </div>

          <div className='grid translate-x-[18px] translate-y-3 grid-cols-22 whitespace-nowrap pt-1 pb-2 text-2xs sm:translate-x-[19px] md:translate-x-[23px] lg:translate-x-[22px] lg:pb-0 xl:translate-x-[34px] 2xl:translate-x-[46px]'>
            {raceDates.map((date, i) => (
              <div
                key={i}
                className={`lg: flex origin-left translate-x-px -rotate-45 items-center justify-center rounded-sm bg-white py-sm px-2.5 lg:h-4.5 lg:w-4.5 lg:rotate-0 lg:px-0 lg:text-center lg:ring-1 lg:ring-black/[.08] ${
                  i === 12
                    ? 'z-[1] bg-gray-850 text-white shadow-lg shadow-black/25 lg:border-transparent'
                    : 'lg:shadow-md lg:shadow-black/5'
                }`}
              >
                <div className={`flex space-x-xs lg:block lg:translate-y-xs ${i === 12 ? 'lg:text-white' : ''}`}>
                  <div className='text-3xs font-bold leading-none tracking-tighter'>{date.month}</div>
                  <div className='text-3xs font-bold leading-none lg:text-sm lg:font-normal'>{date.day}</div>
                </div>
              </div>
            ))}
          </div>

          <div className='grid grid-cols-22 grid-rows-[7]'>
            <div className='col-start-1 col-end-2 row-start-1 row-end-[8]'>
              <div className='border-b border-r border-b-gray-100 border-r-gray-50 pt-8 text-xs text-gray-500 [border-bottom-style:dashed]'>
                600
              </div>
              <div className='border-b border-r border-b-gray-100 border-r-gray-50 pt-8 text-xs text-gray-500 [border-bottom-style:dashed]'>
                500
              </div>
              <div className='border-b border-r border-b-gray-100 border-r-gray-50 pt-8 text-xs text-gray-500 [border-bottom-style:dashed]'>
                400
              </div>
              <div className='border-b border-r border-b-gray-100 border-r-gray-50 pt-8 text-xs text-gray-500 [border-bottom-style:dashed]'>
                300
              </div>
              <div className='border-b border-r border-b-gray-100 border-r-gray-50 pt-8 text-xs text-gray-500 [border-bottom-style:dashed]'>
                200
              </div>
              <div className='border-b border-r border-b-gray-100 border-r-gray-50 pt-8 text-xs text-gray-500 [border-bottom-style:dashed]'>
                100
              </div>
              <div className='border-b border-r border-b-gray-100 border-r-gray-50 pt-8 text-xs text-gray-500 [border-bottom-style:dashed]'>
                0
              </div>
            </div>

            <div className='col-start-2 col-end-[23] row-start-1 row-end-3'>
              <div className='grid h-full grid-cols-21'>
                {[...Array(42)].map((_, i) => (
                  <div
                    key={i}
                    className={`border-b border-r border-r-gray-50 border-b-gray-100 [border-bottom-style:dashed] ${
                      i % 21 === 11 ? 'border-r-gray-800' : ''
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className='relative col-start-2 col-end-[23] row-start-3 row-end-[8]'>
              <div className='grid h-full grid-cols-21'>
                {[...Array(105)].map((_, i) => (
                  <div
                    key={i}
                    className={`relative border-b border-r border-r-gray-50 border-b-gray-100 [border-bottom-style:dashed] ${
                      i % 21 === 11
                        ? 'border-r-gray-800 after:absolute after:-bottom-2 after:-right-px after:block after:h-2 after:w-px after:bg-gray-800'
                        : ''
                    }`}
                  />
                ))}
              </div>

              <div className='absolute -inset-x-[6px] -inset-y-[5px]'>
                <LineChart chartData={chartData} />
              </div>
            </div>
          </div>

          <div className='grid grid-cols-22 justify-items-end whitespace-nowrap pt-1 pb-6 text-2xs text-gray-600'>
            {raceNames.map((name, i) => (
              <div
                key={i}
                className={`origin-top-right -translate-x-px -rotate-45 py-xs px-[6px] ${
                  i === 12
                    ? 'rounded-sm bg-gray-850 font-bold tracking-tighter text-white shadow-lg shadow-black/25'
                    : ''
                }`}
              >
                {name}
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  )
}

export default Home
