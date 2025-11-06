import { CreateDateColumn, PrimaryColumn, UpdateDateColumn } from "typeorm";

export abstract class DatabaseEntity {
  @PrimaryColumn("uuid")
  id: string;

  @CreateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  updatedAt: Date;
}
