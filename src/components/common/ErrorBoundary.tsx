import React from 'react';
import {ScrollView, SafeAreaView, DevSettings} from 'react-native';
import {isProd} from '../../config/configMode';
import {sizes} from '../../context/ThemeContext';
import FirebaseCrash from '../../Crashlytics/FirebaseCrash';
import SentryCrash from '../../Crashlytics/Sentry';
import SentryTypeError from '../../typings/SentryTypeError';
import MyButton from '../controls/MyButton';
import MyText from '../controls/MyText';

class ErrorBoundary extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {hasError: false, safeStack: '', message: ''};
  }

  static getDerivedStateFromError(error) {
    return {hasError: true, safeStack: error.stack, message: error?.message ?? ''};
  }

  componentDidCatch(error, errorInfo) {
    FirebaseCrash.log(JSON.stringify(error));
    error.safeStack = error.stack;
    SentryCrash.catch(error, SentryTypeError.ErrorBoundary);
    FirebaseCrash.catch(error, SentryTypeError.ErrorBoundary);
  }

  render() {
    if (isProd) {
      return this.props.children;
    }

    if (this.state.hasError) {
      return (
        <SafeAreaView
          style={{
            margin: sizes[20],
            flexGrow: 1,
          }}>
          <ScrollView style={{flexGrow: 1}}>
            <MyText
              style={{
                fontSize: sizes[16],
                marginBottom: sizes[20],
              }}>
              {this.state.message}
            </MyText>
            <MyText
              style={{
                fontSize: sizes[14],
              }}>
              {this.state.safeStack}
            </MyText>
          </ScrollView>
          <MyButton
            onPress={() => {
              DevSettings.reload();
            }}>
            Restart
          </MyButton>
        </SafeAreaView>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
