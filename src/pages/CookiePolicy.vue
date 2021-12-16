<template>
  <q-page padding class="container q-pa-lg">
    <q-card flat bordered class="bg-contrast">
      <q-card-section class="text-center text-h6"> Cookie Policy </q-card-section>

      <q-separator inset />
      <q-card-section>
        The CFM website uses cookies and other tracking technologies. In summary, these distinguish
        you from other users of our website and may:
        <ul>
          <li>be essential to the running of the website;</li>
          <li>help the website to perform more effectively;</li>
          <li>allow us to deliver a more personalised browsing experience;</li>
          <li>keep you up to date with CFM, even after you have left the website;</li>
          <li>enable us to understand our users’ browsing behaviour; and/or</li>
          <li>allow us to improve the website.</li>
        </ul>
      </q-card-section>

      <q-separator inset />
      <q-card-section class="text-center text-h6 text-uppercase">
        What are cookies and tracking technologies?
      </q-card-section>
      <q-card-section>
        These essentially enable us (or our third party partners, as detailed below) to store
        information on your browser or device to enable us or them to identify you and monitor
        certain activities, for the purposes set out in this policy.<br />

        They may:
        <ol type="i">
          <li>
            expire at the end of your browser session (allowing us to link your activities during
            that session – these are often called “session cookies”);
          </li>
          <li>
            be stored on your browser/device in between sessions, enabling us to remember your
            preferences and actions for future visits. They need to be manually deleted or will
            expire after the particular period set by that cookie – these are often referred to as
            “persistent cookies”;
          </li>
          <li>be set by CFM, which are often referred to as “first-party cookies”; or</li>
          <li>be set by third parties – often referred to as “third party cookies”.</li>
        </ol>

        <b
          >Importantly, we will not use any cookies/tracking technologies (or permit any third
          parties to place these on our website) which are not strictly necessary for the operation
          of the website, without first getting your consent.</b
        ><br /><br />
        You can always change your mind about all types of cookies/tracking technologies (see “How
        to block these cookies/tracking technologies” section below).<br /><br />
        Please note that third parties (including, for example, advertising networks and providers
        of external services like web traffic analysis services) may also use cookies/similar
        technologies, over which we have no control. These are subject to the terms of the relevant
        third parties’ policies so please read these carefully.
      </q-card-section>

      <q-separator inset />
      <q-card-section class="text-center text-h6 text-uppercase">
        What types of cookies/tracking technologies do we use?
      </q-card-section>
      <q-card-section>
        <q-table
          :rows="tracking"
          :columns="trackingColumns"
          row-key="name"
          wrap-cells
          :dark="$dark.enabled"
        />
      </q-card-section>

      <q-separator inset />
      <q-card-section class="text-center text-h6 text-uppercase">
        How to block these cookies/tracking technologies
      </q-card-section>
      <q-card-section>
        You can manage your settings and block cookies/tracking technologies by activating the
        setting on your browser that allows you to refuse the setting of all or some cookies.
        However, if you use your browser settings to block all cookies (including strictly necessary
        cookies) you may not be able to access all or parts of our website.
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script lang="ts">
import { Vue } from "vue-class-component";
import { QTable } from "quasar";

export default class CookiePolicy extends Vue {
  get trackingColumns(): QTable["columns"] {
    return [
      {
        name: "name",
        label: "Name",
        field: "name",
        align: "left",
      },
      {
        name: "purpose",
        label: "Purpose",
        field: "purpose",
        align: "left",
      },
      {
        name: "description",
        label: "Description",
        field: "description",
        align: "left",
      },
    ];
  }

  get tracking() {
    return [
      {
        name: "Google Analytics",
        purpose: "Analytical/performance",
        description:
          "Google Analytics software helps us to recognise and count the number of " +
          "website visitors, to see how visitors move around and use our website " +
          "(including time spent on pages, download errors, click throughs etc). This " +
          "helps us to ensure that our website is operating effectively and improve our services.",
      },
    ];
  }
}
</script>
