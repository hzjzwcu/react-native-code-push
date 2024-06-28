import common from '@ohos.app.ability.common';
import { CodePush } from './CodePush'
import bundleManager from '@ohos.bundle.bundleManager';
import Logger from './Logger';

declare function getContext(context: any): common.UIAbilityContext;

let context = getContext(this) as common.UIAbilityContext;

const TAG = 'CodePushBuilder'

export class CodePushBuilder {
  private mDeploymentKey: string = '';
  private mIsDebugMode: boolean = false;
  private mPublicKeyResourceDescriptor: number = -1;

  constructor() {
    let bundleFlags = bundleManager.BundleFlag.GET_BUNDLE_INFO_WITH_APPLICATION;
    let bundleInfo = bundleManager.getBundleInfoForSelfSync(bundleFlags);
    let appProvisionType = bundleInfo.appInfo.appProvisionType
    Logger.info(TAG, `CodePushBuilder appProvisionType:${appProvisionType}`)
    let deploymentKeyConfigName;
    if (appProvisionType === 'release') {
      deploymentKeyConfigName = 'production';
    } else {
      deploymentKeyConfigName = 'Staging';
    }
    let deploymentKey = context.resourceManager.getStringByNameSync(deploymentKeyConfigName);
    this.mDeploymentKey = deploymentKey;
    Logger.info(TAG, `CodePushBuilder getDeploymentKey:${deploymentKey}`)
  }

  public setIsDebugMode(isDebugMode: boolean) {
    this.mIsDebugMode = isDebugMode;
    return this;
  }

  public setPublicKeyResourceDescriptor(publicKeyResourceDescriptor: number) {
    this.mPublicKeyResourceDescriptor = publicKeyResourceDescriptor;
    return this;
  }

  public build() {
    return new CodePush(this.mDeploymentKey, context, this.mIsDebugMode, this.mPublicKeyResourceDescriptor);
  }
}