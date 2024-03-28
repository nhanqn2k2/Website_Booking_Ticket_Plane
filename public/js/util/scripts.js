const recommend = [
    "Vũng Tàu",
    "Bắc Giang",
    "Bắc Kạn",
    "Bạc Liêu",
    "Bắc Ninh",
    "Bến Tre",
    "Bình Định",
    "Bình Dương",
    "Bình Phước",
    "Bình Thuận",
    "Cà Mau",
    "Cần Thơ",
    "Cao Bằng",
    "Đà Nẵng",
    "Đắk Lắk",
    "Điện Biên",
    "Đồng Nai",
    "Đồng Tháp",
    "Gia Lai",
    "Hà Giang",
    "Hà Nội",
    "Hà Tĩnh",
    "Hải Dương",
    "Hải Phòng",
    "Hậu Giang",
    "Hòa Bình",
    "Hưng Yên",
    "Kiên Giang",
    "Kon Tum",
    "Lai Châu",
    "Lâm Đồng",
    "Lạng Sơn",
    "Lào Cai",
    "Long An",
    "Nam Định",
    "Ninh Bình",
    "Ninh Thuận",
    "Phú Thọ",
    "Phú Yên",
    "Quảng Bình",
    "Quảng Nam",
    "Quảng Ninh",
    "Quảng Trị",
    "Sóc Trăng",
    "Sơn La",
    "Tây Ninh",
    "Thái Bình",
    "Thái Nguyên",
    "Thanh Hóa",
    "Tiền Giang",
    "TP Hồ Chí Minh",
    "Trà Vinh",
    "Tuyên Quang",
    "Vĩnh Long",
    "Vĩnh Phúc",
    "Yên Bái",
    "Cam Ranh"
];

const noidi = document.querySelector('.noidi')
const noiden = document.querySelector('.noiden')
const list_noidi = document.getElementById('topics').getElementsByTagName('option')
const list_noiden = document.getElementById('topics1').getElementsByTagName('option')

function seacrh(noidi, list_noidi) {
    noidi.onkeyup = function (e) {
        let dataSearch = e.target.value
        console.log(dataSearch)
        let listData = []
        if (dataSearch) {
            // Lọc ra những data có chứa những chữ giống với keywork của người dùng nhập vào.
            listData = recommend.filter((data) => {
                return data.toLocaleLowerCase().startsWith(dataSearch.toLocaleLowerCase())
            })

            // Lặp qua và tạo ra thẻ để hiển thị ra mà hình.
            for (let i = 0; i < list_noidi.length; i++) {
                if (listData[i] !== undefined) {
                    list_noidi[i].value = listData[i]
                }
            }
        }
    }
}

seacrh(noidi, list_noidi)
seacrh(noiden, list_noiden)

function checkUrl() {
    const url = window.location.pathname.split('/')
    let distance = document.getElementById('distance')
    let money = document.getElementById('price')

    if (url[2] === 'update_plane') {
        distance.id = 'distance_update'
        money.id = 'money_update'
    } else if(url[2] == 'add_plane') {
        console.log(url[2])
        distance.id = 'distance'
        money.id = 'money'
    }
}

checkUrl()

function calculateDistance() {
    const location1 = document.getElementById('noidi').value;
    const location2 = document.getElementById('noiden').value;
    const rankPlane = document.getElementById('airline').value;
    const flightId = document.getElementById('flightId');
    const detailId = document.getElementById('detailId');
    const total_seat = document.getElementById('total_seat')
    const available_seat = document.getElementById('available_seat')
    const price = document.getElementById('money_update')
    const seri = document.getElementById('seri')
    const url = window.location.pathname.split('/')

    // Chi tiet chuyen bay
    if (url[2] == 'update_plane') {
        axios.get(`http://localhost:3000/api/flight/detail?flightId=${flightId.innerHTML}&detailId=${detailId.innerHTML}`)
            .then(detail => {
                total_seat.value = detail.data.totalSeat
                available_seat.value = detail.data.availableSeat
                seri.value = detail.data._id
                flightId.innerHTML = detail.data.flightId
                detailId.innerHTML = detail.data.airLightId
                price.value = detail.data.price.toLocaleString('en-US') + " VNĐ"
            })
            .catch(error => console.log(error))
    }
    let bonus = 1;
    if (rankPlane !== undefined) {
        if (rankPlane === 'Thương gia') bonus = 2.3
    }

    // Gọi API Geocoding của OpenRouteService để lấy tọa độ của hai địa điểm
    axios.get(`https://api.openrouteservice.org/geocode/search?api_key=5b3ce3597851110001cf6248e019bc96b3b344a5a363daadd476e8fc&text=${location1}`)
        .then(response1 => {
            // Lấy toạ độ của nơi đi
            const lat1 = response1.data.features[0].geometry.coordinates[1];
            const lng1 = response1.data.features[0].geometry.coordinates[0];

            axios.get(`https://api.openrouteservice.org/geocode/search?api_key=5b3ce3597851110001cf6248e019bc96b3b344a5a363daadd476e8fc&text=${location2}`)
                .then(response2 => {
                    // Lấy toạ độ của nơi đến
                    const lat2 = response2.data.features[0].geometry.coordinates[1];
                    const lng2 = response2.data.features[0].geometry.coordinates[0];

                    // Tính khoảng cách giữa hai tọa độ bằng API Directions của OpenRouteService
                    axios.get(`https://api.openrouteservice.org/v2/directions/driving-car?api_key=5b3ce3597851110001cf6248e019bc96b3b344a5a363daadd476e8fc&start=${lng1},${lat1}&end=${lng2},${lat2}`)
                        .then(response3 => {
                            const distance = (response3.data.features[0].properties.segments[0].distance / 1000).toFixed(1);
                            const money = (distance * 2300 * bonus).toLocaleString('en-US') + " VNĐ"
                            // Hiển thị khoảng cách trên trang web
                            document.getElementById('distance').value = `${distance}`;
                            document.getElementById('money').value = `${money}`;
                        })
                        .catch(error => {
                            console.error(error);
                        });
                })
                .catch(error => {
                    console.error(error);
                });
        })
        .catch(error => {
            console.error(error);
        });
}