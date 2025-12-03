// src/App.jsx
import { useEffect, useState } from 'react';
import './App.css';
import './components/CityButtons.css';
import './components/WeatherCard.css';
import { fetchWeather } from './api/weather';
import SearchBox from './components/SearchBox';
import Hello from './components/hello';
import TimeThemeContainer from './components/TimeThemeContainer';
import DateTimeDisplay from './components/DateTimeDisplay';

// 한글 도시명을 영문으로 변환하는 매핑 객체
const cityNameMapping = {
  '서울': 'Seoul',
  '부산': 'Busan',
  '인천': 'Incheon',
  '대구': 'Daegu',
  '대전': 'Daejeon',
  '광주': 'Gwangju',
  '울산': 'Ulsan',
  '세종': 'Sejong',
  '수원': 'Suwon',
  '성남': 'Seongnam',
  '용인': 'Yongin',
  '고양': 'Goyang',
  '춘천': 'Chuncheon',
  '강릉': 'Gangneung',
  '청주': 'Cheongju',
  '천안': 'Cheonan',
  '전주': 'Jeonju',
  '목포': 'Mokpo',
  '포항': 'Pohang',
  '창원': 'Changwon',
  '제주': 'Jeju'
};

// 한글 도시명을 영문으로 변환하는 함수
const convertToEnglishCityName = (cityName) => {
  return cityNameMapping[cityName] || cityName;
};

// 도시 버튼 컴포넌트
const CityButtons = ({ isOpen, toggleDropdown, onCityClick, selectedCity }) => {
  return (
    <div className="city-dropdown">
      <button className="dropdown-toggle" onClick={toggleDropdown}>
        {selectedCity || '도시 선택'}
      </button>

      <div className={`city-buttons-container ${isOpen ? 'on' : ''}`}>
        {Object.keys(cityNameMapping).map((city) => (
          <button
            key={city}
            onClick={() => onCityClick(city)}
            className={`city-button ${selectedCity === city ? 'active' : ''}`}
          >
            {city}
          </button>
        ))}
      </div>
    </div>
  );
};

function App() {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const [searchCity, setSearchCity] = useState('서울');

  // 🔹 드롭다운 열림/닫힘 상태
  const [isOpen, setIsOpen] = useState(false);

  // 🔹 선택된 도시 상태
  const [selectedCity, setSelectedCity] = useState('서울');

  const handleSearch = async (city) => {
    try {
      const englishCityName = convertToEnglishCityName(city);
      const data = await fetchWeather(englishCityName);
      setWeather(data);
      setSearchCity(city);
      setError(null);
    } catch (err) {
      setError('도시를 찾을 수 없습니다.');
      setWeather(null);
    }
  };

  // 도시 버튼 클릭 시
  const handleCityClick = (city) => {
    setSelectedCity(city);   // 버튼에 active 표시용
    handleSearch(city);      // 날씨 API 호출
    setIsOpen(false);        // 드롭다운 닫기
  };

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    handleSearch('서울');
  }, []);

  return (
    <TimeThemeContainer>
      <h1 className="app-title">ONDO</h1>

      {/* 현재 날짜/요일/시간 표시 */}
      <DateTimeDisplay />

      <Hello />

      <CityButtons
        isOpen={isOpen}
        toggleDropdown={toggleDropdown}
        selectedCity={selectedCity}
        onCityClick={handleCityClick}
      />

      

      {error && <p className="error-message">{error}</p>}

      {weather ? (
        <div className="weather-card">
          <p className="weather-info"><img src="./public/lucide_map-pin.svg" alt="" /> {searchCity}</p>
          <p className="weather-info"><img src="./public/solar_temperature-linear.svg" alt="" />{weather.main.temp}°C</p>
          <p className="weather-info"><img src="./public/ph_cloud-sun-thin.svg" alt="" /> {weather.weather[0].description}</p>
        </div>
      ) : (
        <p className="loading-message">날씨 정보를 불러오는 중...</p>
      )}
    </TimeThemeContainer>
  );
}

export default App;
