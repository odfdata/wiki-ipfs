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
      fontFamily: "Lekton"
    },
    h2: {
      fontSize: 36,
      fontWeight: 400,
      fontFamily: "Lekton"
    },
    h3: {
      fontSize: 24,
      fontFamily: "Lekton",
      fontWeight: "bold"
    },
    h4: {
      fontSize: 20,
      fontFamily: "Lekton",
      fontWeight: "bold"
    },
    h5: {
      fontSize: 16,
      fontFamily: "Lekton"
    },
    h6: {
      fontSize: 14,
      fontFamily: "Lekton"
    },
    body1: {
      fontSize: 16,
      fontFamily: "Lekton"
    },
    body2: {
      fontSize: 12,
      fontFamily: "Lekton"
    },
    subtitle1: {
      fontSize: 16,
      fontFamily: "Lekton"
    },
    button: {
      fontWeight: 600,
      fontFamily: "Lekton"
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
          paddingBottom: 2  // Lekton font makes it not correctly aligned
        }
      }
    }
  }
});
