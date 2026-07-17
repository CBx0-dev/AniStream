import {expect} from "vitest";

import {TestBase, TestDefinition} from "@test/suite";

import {UserService} from "@contracts/user.contract";

import type {ProfileModel} from "@models/profile.model";

class UserTests extends TestBase {
    private get userService(): UserService {
        return this.getService(UserService);
    }

    private async createProfile() {
        const john: ProfileModel = await this.userService.createProfile("john", "fff", "eyes1" as any, "mouth1" as any, "dark", "en");

        expect(john.profile_id).toBe(1);
        expect(john.name).toBe("john");
    }

    private async getProfiles() {
        await this.userService.createProfile("john", "fff", "eyes1" as any, "mouth1" as any, "dark", "en");
        await this.userService.createProfile("jane", "000", "eyes2" as any, "mouth2" as any, "light", "de");

        const profiles: ProfileModel[] = await this.userService.getProfiles();

        expect(profiles).toHaveLength(2);
    }

    private async getProfileByUUID() {
        const john: ProfileModel = await this.userService.createProfile("john", "fff", "eyes1" as any, "mouth1" as any, "dark", "en");
        await this.userService.createProfile("jane", "000", "eyes2" as any, "mouth2" as any, "light", "de");
        const profileByUuid: ProfileModel | null = await this.userService.getProfileByUUID(john.uuid);

        expect(profileByUuid).not.toBeNull();
        expect(profileByUuid!.name).toBe("john");
    }

    private async getProfileByName() {
        const jane = await this.userService.createProfile("jane", "000", "eyes2" as any, "mouth2" as any, "light", "de");

        const profiles: ProfileModel[] = await this.userService.getProfiles();
        const found = profiles.find(p => p.name === "jane");

        expect(found).not.toBeUndefined();
        expect(found!.name).toBe("jane");
        expect(found!.uuid).toBe(jane.uuid);
    }

    private async getProfileById() {
        const john: ProfileModel = await this.userService.createProfile("john", "fff", "eyes1" as any, "mouth1" as any, "dark", "en");

        const profiles: ProfileModel[] = await this.userService.getProfiles();
        const found = profiles.find(p => p.profile_id === john.profile_id);

        expect(found).not.toBeUndefined();
        expect(found!.name).toBe("john");
    }

    private async getActiveProfile() {
        const active = await this.userService.getActiveProfile();
        expect(active).not.toBeNull();
    }

    private async updateProfile() {
        const john: ProfileModel = await this.userService.createProfile("john", "fff", "eyes1" as any, "mouth1" as any, "dark", "en");

        await this.userService.updateProfile(john.profile_id, "johnny", "000", "eyes2" as any, "mouth2" as any, "light", "de", true, true);

        const profiles = await this.userService.getProfiles();
        const updated = profiles.find(p => p.profile_id == john.profile_id);

        expect(updated).not.toBeUndefined();
        expect(updated!.name).toBe("johnny");
        expect(updated!.background_color).toBe("000");
        expect(updated!.theme).toBe("light");
    }

    public getTests(): TestDefinition[] {
        return [
            ["CreateProfile", this.createProfile],
            ["GetProfiles", this.getProfiles],
            ["GetProfileByUUID", this.getProfileByUUID],
            ["GetProfileByName", this.getProfileByName],
            ["GetProfileById", this.getProfileById],
            ["GetActiveProfile", this.getActiveProfile],
            ["UpdateProfile", this.updateProfile]
        ];
    }
}

TestBase.register(UserTests);
