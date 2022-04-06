package com.rolbox;
import android.os.Bundle;
import com.facebook.react.ReactActivity;
import org.devio.rn.splashscreen.SplashScreen;

public class MainActivity extends ReactActivity {
    protected static  boolean isSplashScreen = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        SplashScreen.show(this);
        super.onCreate(savedInstanceState);
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        MainActivity.isSplashScreen = true;
    }

    @Override
    protected void onResume() {
        super.onResume();
        if(MainActivity.isSplashScreen) {
            SplashScreen.hide(this);
        }
    }

    @Override
    protected void onStart() {
        super.onStart();
        if(MainActivity.isSplashScreen) {
            SplashScreen.hide(this);
        }
    }

    @Override
    protected void onStop() {
        super.onStop();
        MainActivity.isSplashScreen = true;
    }

    @Override
    protected void onPause() {
        super.onPause();
        MainActivity.isSplashScreen = true;
    }

    @Override
    protected void onRestart() {
        super.onRestart();
        MainActivity.isSplashScreen = true;
    }

    @Override
  protected String getMainComponentName() {
    return "rollbox";
  }
}
