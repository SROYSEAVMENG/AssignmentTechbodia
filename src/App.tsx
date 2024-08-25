import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

interface Country {
  name: {
    common: string;
    official: string;
    nativeName?: {
      [languageCode: string]: {
        official: string;
        common: string;
      };
    };
  };
  tld: string[];
  cca2: string;
  ccn3: string;
  cca3: string;
  independent: boolean;
  status: string;
  unMember: boolean;
  currencies: {
    [currencyCode: string]: {
      name: string;
      symbol: string;
    };
  };
  idd: {
    root: string;
    suffixes: string[];
  };
  capital?: string[];
  altSpellings: string[];
  region: string;
  languages: { [languageCode: string]: string };
  translations: {
    [languageCode: string]: {
      official: string;
      common: string;
    };
  };
  latlng: number[];
  landlocked: boolean;
  area: number;
  demonyms?: {
    eng: {
      f: string;
      m: string;
    };
  };
  flag: string;
  maps: {
    googleMaps: string;
    openStreetMaps: string;
  };
  population: number;
  car: {
    signs: string[];
    side: string;
  };
  timezones: string[];
  continents: string[];
  flags: {
    png: string;
    svg: string;
  };
  coatOfArms: {};
  startOfWeek: string;
  capitalInfo?: {
    latlng: number[];
  };
}

function App() {

  const [centralData, setCentralData] = useState<Country[]>()
  const [data, setData] = useState<Country[]>([])
  const [page, setPage] = useState(0)
  const [input, setInput] = useState("")
  const [singleData, setSingleData] = useState<Country>()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        const json = await response.json();
        setCentralData(json);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        const json = await response.json();
        setData(json.slice(25 * page, 25 * page + 25));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

  }, [page]);

  function handleInput(event: React.ChangeEvent<HTMLInputElement>) {
    setInput(event.target.value)
  }

  function asc() {
    setData([...data].sort((a, b) => a.name.official.localeCompare(b.name.official)))
    setCentralData([...centralData!].sort((a, b) => a.name.official.localeCompare(b.name.official)))
  }

  function desc() {
    setData([...data].sort((a, b) => b.name.official.localeCompare(a.name.official)))
    setCentralData([...centralData!].sort((a, b) => b.name.official.localeCompare(a.name.official)))
  }

  function popUp(cca2: string) {
    let popup = data.filter((item) => item.cca2 === cca2)[0]
    setSingleData(popup)
  }

  return (
    <>
      <h1>Country Table</h1>
    <div className='container'>

    <div className='left-element'>
          <input type="text" className='form-control' style={{width:'250px', justifyContent:'center'}} id="search" value={input} onChange={handleInput} placeholder="Search countries..." />
      </div>
      <div className='right-element'>
          <button className='btn btn-primary'style={{backgroundColor:'blue'}} onClick={asc}>asc sort</button>
          <button className='btn btn-primary'style={{backgroundColor:'blue'}} onClick={desc}>desc sort</button>
      </div>


    </div>    
    <table id="countryTable">
        <thead>
          <tr>
            <th scope="col">Flag</th>
            <th scope="col">Country Name</th>
            <th scope="col">2 character Country Code</th>
            <th scope="col">3 character Country Code</th>
            <th scope="col">Native Country Name</th>
            <th scope="col">Alternative Country Name</th>
            <th scope="col">Country Calling Codes</th>
          </tr>
        </thead>
        {
          input != "" ?
            <tbody>
              {
                centralData?.filter((item) => item.name.official.toLowerCase().includes(input.toLowerCase())).slice(0, 10).map((t, index) => {
                  return <tr key={index} onClick={() => popUp(t.cca2)}>
                    <td>
                      <img src={t.flags.png} />
                    </td>
                    <td>{t.name.official}</td>
                    <td>{t.cca2}</td>
                    <td>{t.cca3}</td>
                    <td>{t.name?.nativeName ? Object.values(t.name.nativeName).map((p) => p.common).join(', ') : "No Native Name"}</td>
                    <td>{t.altSpellings}</td>
                    <td>{t.idd.root}</td>
                  </tr>
                })
              }
            </tbody>
            : <tbody>
              {
                data.map((t, index) => {
                  return <tr key={index} onClick={() => popUp(t.cca2)}>
                    <td>
                      <img src={t.flags.png} />
                    </td>
                    <td>{t.name.official}</td>
                    <td>{t.cca2}</td>
                    <td>{t.cca3}</td>
                    <td>{t.name?.nativeName ? Object.values(t.name.nativeName).map((p) => p.common).join(', ') : "No Native Name"}</td>
                    <td>{t.altSpellings}</td>
                    <td>{t.idd.root}</td>
                  </tr>
                })
              }
            </tbody>
        }
      </table>
      {!input && <div className="pagination">
        <button id="prevBtn" className='btn btn-primary'style={{backgroundColor:'blue'}} onClick={() => { if (page > 0) setPage(page - 1) }}>Previous</button>
        <button id="nextBtn" className='btn btn-primary' style={{backgroundColor:'blue'}} onClick={() => setPage(page + 1)}>Next</button>
      </div>}
      {singleData && <div className='pop'>
        <i onClick={() => setSingleData(undefined)}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </i>
        <img style={{width:'220px',height:'150px'}} src={singleData.flags.png} />
        <p> Country Name : {(singleData.name.official)}</p>
        <p> 2 character Country Code : {(singleData.cca2)}</p>
        <p> 3 character Country Code : {(singleData.cca3)}</p>
        <p> Native Country Name      : {(singleData.name?.nativeName ? Object.values(singleData.name.nativeName).map((p) => p.common).join(', ') : "No Native Name")}</p>
        <p> Alternative Country Name : {(singleData.altSpellings)}</p>
        <p> Country Calling Codes    : {(singleData.idd.root)}</p>
      </div>}
    </>
  )
}

export default App


