package bdom.kikwit.Dto;

import com.fasterxml.jackson.annotation.JsonRootName;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @NoArgsConstructor @AllArgsConstructor
@JsonRootName(value="role")
public class RoleRequestDto {
    @Schema(description = "identifiant unique du role",example = "1")
    private Long id;
    @Schema(description = "libelle du role",example = "Administrateur")
    private String libelle;
}
