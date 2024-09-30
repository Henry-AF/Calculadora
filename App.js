import React, { useState } from 'react';
import { SafeAreaView, Text, View, TouchableOpacity, StyleSheet } from 'react-native';

export default function App() {
  const [display, setDisplay] = useState('0');
  const [firstValue, setFirstValue] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waitingForSecondValue, setWaitingForSecondValue] = useState(false);

  const handleTap = (type, value) => {
    if (type === 'number') {
      setDisplay((prevDisplay) => {
        if (waitingForSecondValue) {
          setWaitingForSecondValue(false);
          return `${value}`;
        }
        return prevDisplay === '0' ? `${value}` : `${prevDisplay}${value}`;
      });
    }

    if (type === 'decimal') {
      setDisplay((prevDisplay) => {
        if (waitingForSecondValue) {
          setWaitingForSecondValue(false);
          return '0.';
        }
        // Evitar múltiplos pontos
        if (!prevDisplay.includes('.')) {
          return `${prevDisplay}.`;
        }
        return prevDisplay;
      });
    }

    if (type === 'operator') {
      setOperator(value);
      setFirstValue(parseFloat(display));
      setWaitingForSecondValue(true);
    }

    if (type === 'equal') {
      const secondValue = parseFloat(display);
      if (operator && firstValue !== null) {
        if (operator === '+') {
          setDisplay(`${firstValue + secondValue}`);
        } else if (operator === '-') {
          setDisplay(`${firstValue - secondValue}`);
        } else if (operator === '*') {
          setDisplay(`${firstValue * secondValue}`);
        } else if (operator === '/') {
          setDisplay(`${firstValue / secondValue}`);
        }
      }
      setOperator(null);
      setFirstValue(null);
    }

    if (type === 'clear') {
      setDisplay('0');
      setFirstValue(null);
      setOperator(null);
      setWaitingForSecondValue(false);
    }
  };

  const buttons = [
    ['7', '8', '9', '/'],
    ['4', '5', '6', '*'],
    ['1', '2', '3', '-'],
    ['0', '.', 'C', '+'],
    ['=']
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.display}>{display}</Text>
      {buttons.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((buttonValue) => (
            <TouchableOpacity
              key={buttonValue}
              style={['+', '-', '*', '/'].includes(buttonValue) ? styles.buttonOperator : styles.button}
              onPress={() => {
                if (buttonValue === 'C') {
                  handleTap('clear');
                } else if (['+', '-', '*', '/'].includes(buttonValue)) {
                  handleTap('operator', buttonValue);
                } else if (buttonValue === '=') {
                  handleTap('equal');
                } else if (buttonValue === '.') {
                  handleTap('decimal');
                } else {
                  handleTap('number', buttonValue);
                }
              }}
            >
              <Text style={styles.buttonText}>{buttonValue}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#0E0C0C',
  },
  display: {
    fontSize: 60,
    marginBottom: 40,
    textAlign: 'right',
    marginRight: 20,
    color: '#FFD700', // Cor amarela
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#424141',
    padding: 20,
    borderRadius: 10,
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#fff',
    shadowOpacity: 0.2,
    shadowOffset: { width: 2, height: 2 },
  },
  buttonOperator: {
    backgroundColor: '#EF712A', // Tom para os operadores
    padding: 20,
    borderRadius: 10,
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#fff',
    shadowOpacity: 0.2,
    shadowOffset: { width: 2, height: 2 },
  },
  buttonText: {
    color:'#fff',
    fontSize: 30,
  },
});
