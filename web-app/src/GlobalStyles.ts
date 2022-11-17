import {createTheme, Theme} from '@mui/material/styles';

export const theme = createTheme({
  typography: {
    fontFamily: [
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    h1: {
      fontSize: 40,
      fontWeight: 500,
      fontFamily: "Roboto"
    },
    h2: {
      fontSize: 30,
      fontWeight: 400,
      fontFamily: "Roboto"
    },
    h3: {
      fontSize: 22,
      fontFamily: "Roboto",
      fontWeight: "bold"
    },
    h4: {
      fontSize: 20,
      fontFamily: "Roboto",
      fontWeight: "bold"
    },
    h5: {
      fontSize: 16,
      fontFamily: "Roboto"
    },
    h6: {
      fontSize: 14,
      fontFamily: "Roboto"
    },
    body1: {
      fontSize: 16,
      fontFamily: "Roboto"
    },
    body2: {
      fontSize: 12,
      fontFamily: "Roboto"
    },
    subtitle1: {
      fontSize: 16,
      fontFamily: "Roboto"
    },
    button: {
      fontWeight: 600,
      fontFamily: "Roboto"
    }
  },
  palette: {
    primary: {
      main: '#DE545B',
      light: '#FF8688',
      dark: '#A71E32'
    },
    secondary: {
      main: '#EAB463',
      light: '#FFE692',
      dark: '#B58435'
    },
    text: {
      primary: '#343434',
      secondary: '#7B7B7B',
      disabled: '#B8B8B8',
    },
    error: { main: '#F44336' },
    success: { main: '#80D283' },
    action: {
      selected: '#E6E6E6'
    }
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        a {
          color: #DE545B
        }
      `
    },
    MuiButton: {
      styleOverrides: {
        root: {
          paddingBottom: 2  // Roboto font makes it not correctly aligned
        }
      }
    }
  }
});
