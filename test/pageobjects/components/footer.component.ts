import { $ } from '@wdio/globals';

class FooterComponent {
    public get container() {
        return $('#site-footer');
    }

    public get privacyPolicyLink() {
        return this.container.$('a[href="/privacy-policy"]');
    }

    public get termsAndConditionsLink() {
        return this.container.$('a[href="/terms-and-conditions"]');
    }

    public get linkedInLink() {
        return this.container.$('a[href="https://www.linkedin.com/company/telnyx"]');
    }

    public get twitterLink() {
        return this.container.$('a[href="https://x.com/telnyx"]');
    }

    public get facebookLink() {
        return this.container.$('a[href="https://www.facebook.com/Telnyx/"]');
    }

    public get shopLink() {
        return this.container.$('a[href="https://shop.telnyx.com/"]');
    }

    public async scrollIntoView() {
        await this.container.scrollIntoView();
    }
}

export default new FooterComponent();
