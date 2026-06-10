package bdom.kikwit.web;

import bdom.kikwit.Dto.GestionMedicamentRequestDto;
import bdom.kikwit.Dto.GestionMedicamentResponseDto;
import bdom.kikwit.Services.GestionMedicamenService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping(path = "/api")
@CrossOrigin("*")
@Tag(name = "Gestion medicament", description = "Gestion des médicaments d'une structure de santé")
public class GestionMedicamentController {
    private GestionMedicamenService service;
    /*
    * Enregistrement de la gestion medicament
    * */
    @PostMapping(path = "/medicaments")
    @Operation(summary = "Enregistrement")
    public GestionMedicamentResponseDto save(@RequestBody GestionMedicamentRequestDto requestDto){
        return service.save(requestDto);
    }
    /*
    * liste gestion des medicaments
    * */
    @GetMapping(path = "/medicaments")
    @Operation(summary = "Liste générale")
    public List<GestionMedicamentResponseDto> list(){
        return service.getAll();
    }
    /*
    * Recupera d'une ligne de gestion par son Id
    * */
    @GetMapping(path = "/medicaments/{id}")
    @Operation(summary = "Affiche un enregistrement")
    public GestionMedicamentResponseDto getOne(@PathVariable Long id){
        return service.getOne(id);
    }
    /*
    Modification d'une ligne de gestion medicament
    * */
    @PatchMapping(path = "/medicaments/{id}")
    @Operation(summary = "Modification d'un enregistrement")
    public GestionMedicamentResponseDto update(@PathVariable Long id,@RequestBody GestionMedicamentRequestDto requestDto){
        return service.update(id,requestDto);
    }
    @DeleteMapping(path = "/medicaments/{id}")
    @Operation(summary = "Supprimé une gestion medicament")
    public String delete(@PathVariable Long id){
        return service.delete(id);
    }

}
