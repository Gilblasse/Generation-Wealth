export const SelectedMode = "development"

export const Mode = {
    production:{
        firebaseConfig: {
            apiKey: "AIzaSyAimfOCOe6sQWV8icWmzZowq87nNj356zs",
            authDomain: "generational-wealth.firebaseapp.com",
            databaseURL: "https://generational-wealth.firebaseio.com",
            projectId: "generational-wealth",
            storageBucket: "generational-wealth.appspot.com",
            messagingSenderId: "486967743800",
            appId: "1:486967743800:web:ea8c080ede02f73cab1dcd",
            measurementId: "G-LLDHD4RK1W"
        },

        smsBaseUrl: "https://generationalwealthsms.herokuapp.com/api/notifications/",
    },

    development:{
        firebaseConfig: {
            apiKey: "AIzaSyAuzjpFHUT8zHyJzdZ0Iw2CGx-6E2UdFJs",
            authDomain: "gw-feature-testing.firebaseapp.com",
            databaseURL: "https://gw-feature-testing.firebaseio.com",
            projectId: "gw-feature-testing",
            storageBucket: "gw-feature-testing.appspot.com",
            messagingSenderId: "750095130601",
            appId: "1:750095130601:web:46cf65924d3e1441177578",
            measurementId: "G-N658SHYH7L"
        },

        smsBaseUrl: "http://localhost:3001/api/notifications/",

    }
}