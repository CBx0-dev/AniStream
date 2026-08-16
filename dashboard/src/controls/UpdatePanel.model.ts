import {UserControl} from "vue-mvvm";

export class UpdatePanelModel extends UserControl {
    public updateAvailable: boolean = this.ref(true);
}