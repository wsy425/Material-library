class tabs {
    static PCA = "active";
    static spectrum = ""
}


class container {
    static PCA = "active";
    static spectrum = "fade"
}
export class AlgorithmTabComponent implements OnInit {
    PCATabClass = tabs.PCA;
    spectrumTabClass = tabs.spectrum;
    PCAContainerClass = container.PCA;
    spectrumContainerClass = container.spectrum;

    Switch(name: string) {
        for (const key of Object.keys(tabs)) {
            if (key == name) {
                tabs[key] = "active"
                container[key] = "active"
            } else {
                tabs[key] = ""
                container[key] = "fade"
            }
        }
        this.PCATabClass = tabs.PCA;
        this.spectrumTabClass = tabs.spectrum;
        this.PCAContainerClass = container.PCA;
        this.spectrumContainerClass = container.spectrum;
    }
}