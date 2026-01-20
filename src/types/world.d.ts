import type { User, UserCredentials, TestCredentials } from '../business/data/user-factory';

declare module '@wdio/cucumber-framework' {
    interface World {
        currentUser?: User | UserCredentials;
        testCredentials?: TestCredentials;
        
    }
}
