package com.eventyr;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.reactlibrary.RNAppAuthPackage;
import com.airbnb.android.react.lottie.LottiePackage;
import com.horcrux.svg.SvgPackage;
import com.cmcewen.blurview.BlurViewPackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.geektime.rnonesignalandroid.ReactNativeOneSignalPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.rnfs.RNFSPackage;
import com.lugg.ReactNativeConfig.ReactNativeConfigPackage;
import com.auth0.react.A0Auth0Package;
import com.rnfs.RNFSPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.geektime.rnonesignalandroid.ReactNativeOneSignalPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.lugg.ReactNativeConfig.ReactNativeConfigPackage;
import com.auth0.react.A0Auth0Package;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNAppAuthPackage(),
            new LottiePackage(),
            new SvgPackage(),
            new BlurViewPackage(),
            new MapsPackage(),
            new VectorIconsPackage(),
            new ReactNativeOneSignalPackage(),
            new LinearGradientPackage(),
            new RNFSPackage(),
            new ReactNativeConfigPackage(),
            new A0Auth0Package(),
            new RNFSPackage(),
            new VectorIconsPackage(),
            new ReactNativeOneSignalPackage(),
            new LinearGradientPackage(),
            new ReactNativeConfigPackage(),
            new A0Auth0Package()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
